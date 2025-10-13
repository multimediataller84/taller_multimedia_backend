import forge from "node-forge";
import fs from "fs/promises";

export class DigitalSign {
  private certPath: string;
  private certPassword: string;
  private certificate: forge.pki.Certificate | null = null;
  private privateKey: forge.pki.rsa.PrivateKey | null = null;

  constructor(certPath: string, certPassword: string) {
    this.certPath = certPath;
    this.certPassword = certPassword;
  }

  async loadCertificate(): Promise<boolean> {
    try {
      const p12Buffer = await fs.readFile(this.certPath);
      const p12Der = p12Buffer.toString("binary");
      const p12Asn1 = forge.asn1.fromDer(p12Der);
      const p12 = forge.pkcs12.pkcs12FromAsn1(p12Asn1, this.certPassword);

      const certBags = p12.getBags({ bagType: forge.pki.oids.certBag });
      const certBagKey = forge.pki.oids.certBag as string;
      const certBag = certBags[certBagKey]?.[0];

      if (!certBag?.cert) {
        throw new Error("Certificate not found in .p12 file");
      }

      const keyBags = p12.getBags({
        bagType: forge.pki.oids.pkcs8ShroudedKeyBag,
      });
      const keyBagKey = forge.pki.oids.pkcs8ShroudedKeyBag as string;
      let keyBag = keyBags[keyBagKey]?.[0];

      if (!keyBag) {
        const altKeyBags = p12.getBags({ bagType: forge.pki.oids.keyBag });
        const altKeyBagsKey = forge.pki.oids.keyBag as string;
        keyBag = altKeyBags[altKeyBagsKey]?.[0];
      }

      if (!keyBag?.key) {
        throw new Error("Private key not found in .p12 file");
      }

      this.certificate = certBag.cert;
      this.privateKey = keyBag.key as forge.pki.rsa.PrivateKey;

      return true;
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : "Unknow error";
      throw new Error(`Error loading certificate: ${errorMsg}`);
    }
  }

  private signXML(xmlString: string): string {
    if (!this.privateKey) {
      throw new Error("You must upload the certificate before signing");
    }

    const md = forge.md.sha256.create();
    md.update(xmlString, "utf8");

    const signature = this.privateKey.sign(md);
    const signatureB64 = forge.util.encode64(signature);

    return signatureB64;
  }

  private insertSignXML(xmlString: string, firma: string): string {
    if (!this.certificate) {
      throw new Error("Certificate not uploaded");
    }

    const certPem = forge.pki.certificateToPem(this.certificate);
    const certB64 = certPem
      .replace("-----BEGIN CERTIFICATE-----", "")
      .replace("-----END CERTIFICATE-----", "")
      .replace(/\n/g, "");

    const md = forge.md.sha256.create();
    md.update(xmlString, "utf8");
    const digestValue = forge.util.encode64(md.digest().getBytes());

    const firmaXML = `
  <ds:Signature xmlns:ds="http://www.w3.org/2000/09/xmldsig#" Id="Signature">
    <ds:SignedInfo>
      <ds:CanonicalizationMethod Algorithm="http://www.w3.org/TR/2001/REC-xml-c14n-20010315"/>
      <ds:SignatureMethod Algorithm="http://www.w3.org/2001/04/xmldsig-more#rsa-sha256"/>
      <ds:Reference URI="">
        <ds:Transforms>
          <ds:Transform Algorithm="http://www.w3.org/2000/09/xmldsig#enveloped-signature"/>
        </ds:Transforms>
        <ds:DigestMethod Algorithm="http://www.w3.org/2001/04/xmlenc#sha256"/>
        <ds:DigestValue>${digestValue}</ds:DigestValue>
      </ds:Reference>
    </ds:SignedInfo>
    <ds:SignatureValue>${firma}</ds:SignatureValue>
    <ds:KeyInfo>
      <ds:X509Data>
        <ds:X509Certificate>${certB64}</ds:X509Certificate>
      </ds:X509Data>
    </ds:KeyInfo>
  </ds:Signature>`;

    const xmlConFirma = xmlString.replace(
      "</FacturaElectronica>",
      `${firmaXML}\n</FacturaElectronica>`
    );

    return xmlConFirma;
  }

  async signDocument(
    xmlString: string
  ): Promise<{ xmlFirmado: string; firma: string }> {
    if (!this.certificate || !this.privateKey) {
      await this.loadCertificate();
    }

    const firma = this.signXML(xmlString);
    const xmlFirmado = this.insertSignXML(xmlString, firma);

    return {
      xmlFirmado,
      firma,
    };
  }
}
