import forge from "node-forge";
import fs from "fs/promises";
import { SignedXml } from "xml-crypto";
export class DigitalSign {
  private certPath: string;
  private certPassword: string;
  private certificate: forge.pki.Certificate | null = null;
  private privateKey: forge.pki.rsa.PrivateKey | null = null;

  constructor(certPath: string, certPassword: string) {
    if (!certPath) {
      throw new Error("The certificate path is required");
    }
    if (!certPassword) {
      throw new Error("The certificate password is required");
    }

    this.certPath = certPath;
    this.certPassword = certPassword;
  }

  async loadCertificate(): Promise<void> {
    try {
      const p12Buffer = await fs.readFile(this.certPath);

      const p12Der = forge.util.decode64(p12Buffer.toString("base64"));

      const p12Asn1 = forge.asn1.fromDer(p12Der);

      const p12 = forge.pkcs12.pkcs12FromAsn1(p12Asn1, this.certPassword);

      const certBags = p12.getBags({ bagType: forge.pki.oids.certBag });
      const certBagKey = forge.pki.oids.certBag;
      const certBagArray = certBagKey ? certBags[certBagKey] || [] : [];

      if (certBagArray.length === 0) {
        throw new Error("No certificate found in the .p12 file");
      }

      const certBag = certBagArray[0];
      if (!certBag?.cert) {
        throw new Error("Invalid certificate in .p12 file");
      }

      const pkcs8Key = forge.pki.oids.pkcs8ShroudedKeyBag;
      const keyBagKey = forge.pki.oids.keyBag;

      let keyBags = pkcs8Key
        ? p12.getBags({
            bagType: pkcs8Key,
          })[pkcs8Key] || []
        : [];

      if (keyBags.length === 0 && keyBagKey) {
        keyBags =
          p12.getBags({
            bagType: keyBagKey,
          })[keyBagKey] || [];
      }

      if (keyBags.length === 0) {
        throw new Error("No private key found in the .p12 file");
      }

      const keyBag = keyBags[0];
      if (!keyBag?.key) {
        throw new Error("Invalid private key in .p12 file");
      }

      this.certificate = certBag.cert;
      this.privateKey = keyBag.key as forge.pki.rsa.PrivateKey;

      if (this.certificate) {
        const now = new Date();
        if (now < this.certificate.validity.notBefore) {
          throw new Error("The certificate is not yet valid");
        }
        if (now > this.certificate.validity.notAfter) {
          throw new Error("The certificate has expired");
        }
      }
    } catch (error) {
      if (error instanceof Error) {
        if (error.message.includes("ENOENT")) {
          throw new Error(
            `Certificate file not found: ${this.certPath}`
          );
        }
        if (
          error.message.includes("Invalid password") ||
          error.message.includes("MAC verify error")
        ) {
          throw new Error("Incorrect certificate password");
        }
        throw error;
      }
      throw new Error("Unknown error loading certificate");
    }
  }

  private getCertB64(): string {
    if (!this.certificate) {
      throw new Error(
        "Certificate not loaded. Please run loadCertificate() first."
      );
    }

    const pem = forge.pki.certificateToPem(this.certificate);
    return pem
      .replace(/-----BEGIN CERTIFICATE-----/g, "")
      .replace(/-----END CERTIFICATE-----/g, "")
      .replace(/\n/g, "")
      .replace(/\r/g, "");
  }

  private getPrivateKeyPem(): string {
    if (!this.privateKey) {
      throw new Error(
        "Private key not loaded. Run loadCertificate() first."
      );
    }

    return forge.pki.privateKeyToPem(this.privateKey);
  }

  private signXML(xml: string): string {
    if (!this.certificate || !this.privateKey) {
      throw new Error("Certificate or private key not loaded");
    }

    try {
      const privateKeyPem = this.getPrivateKeyPem();
      const certB64 = this.getCertB64();

      const sig = new SignedXml({
        privateKey: privateKeyPem,
        publicCert: forge.pki.certificateToPem(this.certificate),
        signatureAlgorithm: "http://www.w3.org/2001/04/xmldsig-more#rsa-sha256",
        canonicalizationAlgorithm:
          "http://www.w3.org/TR/2001/REC-xml-c14n-20010315",
      });

      (sig as any).keyInfoProvider = {
        getKeyInfo: (): string => {
          return `<ds:X509Data><ds:X509Certificate>${certB64}</ds:X509Certificate></ds:X509Data>`;
        },
        getKey: (): string => {
          return privateKeyPem;
        },
      };

      sig.addReference({
        xpath: "/*",
        transforms: [
          "http://www.w3.org/2000/09/xmldsig#enveloped-signature",
          "http://www.w3.org/TR/2001/REC-xml-c14n-20010315",
        ],
        digestAlgorithm: "http://www.w3.org/2001/04/xmlenc#sha256",
        uri: "",
        isEmptyUri: false,
      });

      sig.computeSignature(xml, {
        prefix: "ds",
        location: { reference: "/*", action: "append" },
      });

      return sig.getSignedXml();
    } catch (error) {
      console.error("Error signing XML:", error);
      throw new Error(
        `Error signing XML: ${
          error instanceof Error ? error.message : "Error desconocido"
        }`
      );
    }
  }

  private insertSignature(xml: string, signedXml: string): string {
    try {
      const signatureMatch = signedXml.match(/<Signature[\s\S]*?<\/Signature>/);

      if (!signatureMatch) {
        throw new Error("The signature could not be extracted from the XML.");
      }

      const signatureXml = signatureMatch[0];

      let closingTag = "</FacturaElectronica>";

      if (xml.includes("<TiqueteElectronico")) {
        closingTag = "</TiqueteElectronico>";
      } else if (xml.includes("<NotaCreditoElectronica")) {
        closingTag = "</NotaCreditoElectronica>";
      } else if (xml.includes("<NotaDebitoElectronica")) {
        closingTag = "</NotaDebitoElectronica>";
      }

      return xml.replace(closingTag, `${signatureXml}\n${closingTag}`);
    } catch (error) {
      throw new Error(
        `Error inserting signature: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    }
  }

  private extractSignatureValue(signedXml: string): string {
    let signatureMatch = signedXml.match(
      /<ds:SignatureValue[^>]*>([^<]+)<\/ds:SignatureValue>/
    );

    if (!signatureMatch) {
      signatureMatch = signedXml.match(
        /<SignatureValue[^>]*>([^<]+)<\/SignatureValue>/
      );
    }

    if (!signatureMatch || !signatureMatch[1]) {
      console.log(
        "Signed XML (first 500 characters):",
        signedXml.substring(0, 500)
      );
      throw new Error("The signature value could not be extracted");
    }

    return signatureMatch[1].trim();
  }

  async signDocument(
    xmlString: string
  ): Promise<{ xmlFirmado: string; firma: string }> {
    try {
      if (!xmlString || xmlString.trim().length === 0) {
        throw new Error("The XML to be signed cannot be empty");
      }

      if (!this.certificate || !this.privateKey) {
        await this.loadCertificate();
      }

      const xmlFirmado = this.signXML(xmlString);
      const firma = this.extractSignatureValue(xmlFirmado);

      return {
        xmlFirmado,
        firma,
      };
    } catch (error) {
      console.error("Error signing document:", error);
      throw error;
    }
  }

  isValid(): boolean {
    if (!this.certificate) return false;

    const now = new Date();
    return (
      now >= this.certificate.validity.notBefore &&
      now <= this.certificate.validity.notAfter
    );
  }

  getCertificateInfo(): {
    subject: string;
    issuer: string;
    validFrom: Date;
    validTo: Date;
    serialNumber: string;
  } | null {
    if (!this.certificate) return null;

    return {
      subject: this.certificate.subject.getField("CN")?.value || "N/A",
      issuer: this.certificate.issuer.getField("CN")?.value || "N/A",
      validFrom: this.certificate.validity.notBefore,
      validTo: this.certificate.validity.notAfter,
      serialNumber: this.certificate.serialNumber,
    };
  }
}

export default DigitalSign;