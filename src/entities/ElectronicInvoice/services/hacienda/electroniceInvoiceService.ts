import { config } from "../../../../utilities/config.js";
import type { TInvoiceError } from "../../domain/types/TInvoiceError.js";
import type { TInvoiceResult } from "../../domain/types/TInvoiceResult.js";
import type { TProcessorConfig } from "../../domain/types/TProcessorConfig.js";
import { invoiceValidator } from "../../utils/invoiceValidator.js";
import { GenerateToken } from "../generateToken.js";
import DigitalSign from "./digitalSign.js";
import { ElectroniceInvoiceXML } from "./invoiceXML.js";
import { SendHacienda } from "./sendHacienda.js";
import fs from "fs/promises";
import path from "path";
export class InvoiceProcessor {
  private certificatePath: string;
  private certificatePassword: string;
  private haciendaApiUrl: string;
  private environment: string;
  private invoicesDirectory: string;
  private generateToken = new GenerateToken();

  constructor() {
    this.certificatePath = config.CERTIFICATE_PATH;
    this.certificatePassword = config.CERTIFICATE_PASSWORD;
    this.haciendaApiUrl = config.HACIENDA_API_SANDBOX;
    this.environment =  config.NODE_ENV;
    this.invoicesDirectory =  "./invoices";

    this.validateConfig();
  }

  private validateConfig(): void {
    if (!this.certificatePath) {
      throw new Error("CERTIFICATE_PATH is not configured");
    }
    if (!this.certificatePassword) {
      throw new Error("CERTIFICATE_PASSWORD is not configured");
    }
    if (!this.haciendaApiUrl) {
      throw new Error("HACIENDA_API_SANDBOX is not configured");
    }
    if (!this.environment) {
      throw new Error("ENVIRONMENT is not configured");
    }
  }

  private async ensureInvoicesDirectory(): Promise<void> {
    try {
      await fs.access(this.invoicesDirectory);
    } catch {
      await fs.mkdir(this.invoicesDirectory, { recursive: true });
    }
  }

  private validateInvoice(invoice: any): void {
    if (!invoice) {
      throw new Error("Invoice data is required");
    }

    if (!invoiceValidator(invoice)) {
      throw new Error("The invoice does not comply with the required format");
    }

    if (!invoice.emisor) {
      throw new Error("Issuer data is required");
    }

    if (!invoice.receptor) {
      throw new Error("Recipient data is required");
    }

    if (
      !invoice.detalles ||
      !Array.isArray(invoice.detalles) ||
      invoice.detalles.length === 0
    ) {
      throw new Error("The invoice must have at least one detail");
    }
  }

  private generateXML(invoice: any): { xml: string; clave: string } {
    try {
      const generator = new ElectroniceInvoiceXML(invoice);
      const result = generator.generarXML();

      if (!result.xml || !result.clave) {
        throw new Error("Error generating XML: invalid result");
      }

      return result;
    } catch (error) {
      throw new Error(
        `Error generating XML: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    }
  }

  private async signXML(
    xml: string
  ): Promise<{ xmlFirmado: string; firma: string }> {
    try {
      const signer = new DigitalSign(
        this.certificatePath,
        this.certificatePassword
      );

      const result = await signer.signDocument(xml);

      if (!result.xmlFirmado) {
        throw new Error("Error signing document: Empty signed XML");
      }

      return result;
    } catch (error) {
      if (error instanceof Error) {
        if (error.message.includes("ENOENT")) {
          throw new Error(
            `Certificate not found in: ${this.certificatePath}`
          );
        }
        if (
          error.message.includes("password") ||
          error.message.includes("MAC")
        ) {
          throw new Error("Incorrect certificate password");
        }
        throw new Error(`Error signing XML: ${error.message}`);
      }
      throw new Error("Unknown error when signing XML");
    }
  }

  private async sendToHacienda(
    clave: string,
    xmlFirmado: string,
    emisor: any
  ): Promise<any> {
    try {
      const sender = new SendHacienda(this.haciendaApiUrl, this.environment);

      const response = await sender.sendReceipt(
        clave,
        xmlFirmado,
        emisor,
        await this.generateToken.getToken()
      );

      if (!response) {
        throw new Error("The Treasury did not return a response");
      }

      return response;
    } catch (error) {
      if (error instanceof Error) {
        if (error.message.includes("ECONNREFUSED")) {
          throw new Error(
            "We couldn't connect to Hacienda. Check your internet connection"
          );
        }
        if (error.message.includes("timeout")) {
          throw new Error("Timeout occurred while connecting to Hacienda");
        }
        throw new Error(`Error sending to Hacienda: ${error.message}`);
      }
      throw new Error("Unknown error when sending to Hacienda");
    }
  }

  private async saveXML(clave: string, xmlFirmado: string): Promise<string> {
    try {
      await this.ensureInvoicesDirectory();

      const fileName = `${clave}.xml`;
      const filePath = path.join(this.invoicesDirectory, fileName);

      await fs.writeFile(filePath, xmlFirmado, { encoding: 'utf-8' });

      return filePath;
    } catch (error) {
      throw new Error(
        `Error saving XML: ${
          error instanceof Error ? error.message : "Error desconocido"
        }`
      );
    }
  }

  async processInvoice(
    invoice: any
  ): Promise<TInvoiceResult | TInvoiceError | any/* QUITAR ANY */> {
    let clave: string | undefined;

    try {
      this.validateInvoice(invoice);

      const xmlResult = this.generateXML(invoice);
      clave = xmlResult.clave;

      const signResult = await this.signXML(xmlResult.xml);
/*
      const haciendaResponse = await this.sendToHacienda(
        clave,
        signResult.xmlFirmado,
        invoice.emisor
      );

      console.log(`Enviado a Hacienda`);
*/
      const xmlPath = await this.saveXML(clave, signResult.xmlFirmado);
      throw new Error("corte de proceso");
      
      return {
        success: true,
        clave: clave,
        mensaje: "Invoice processed successfully",
        respuestaHacienda: /*haciendaResponse*/ "",
        xmlPath: xmlPath,
        firma: signResult.firma,
      };
    } catch (error) {
      console.error("Error processing invoice:", error);

      const errorMessage =
        error instanceof Error ? error.message : "Unknown error";

      return {
        success: false,
        error: errorMessage,
        details: error,
        clave: clave ?? "",
      };
    }
  }

  async processBatch(
    invoices: any[]
  ): Promise<(TInvoiceResult | TInvoiceError)[]> {
    const results: (TInvoiceResult | TInvoiceError)[] = [];

    for (const invoice of invoices) {
      const result = await this.processInvoice(invoice);
      results.push(result);
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }

    return results;
  }

  async checkInvoiceStatus(clave: string): Promise<any> {
    try {
      const sender = new SendHacienda(this.haciendaApiUrl, this.environment);

      // consultar hacienda
      //

      throw new Error("Status query method not implemented");
    } catch (error) {
      throw new Error(
        `Error when querying status: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    }
  }

  getConfig(): TProcessorConfig {
    return {
      certificatePath: this.certificatePath,
      certificatePassword: "***",
      haciendaApiUrl: this.haciendaApiUrl,
      environment: this.environment,
      invoicesDirectory: this.invoicesDirectory,
    };
  }
}