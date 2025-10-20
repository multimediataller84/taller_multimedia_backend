import axios from "axios";
import type { TEmitter } from "../../domain/types/TElectroniceInvoice.js";

export class SendHacienda {
  constructor(readonly url: string, readonly ambiente: string) {
    this.url = url;
    this.ambiente = ambiente;
  }

  async sendReceipt(
    clave: string,
    xmlFirmado: string,
    emisor: TEmitter,
    token: string
  ) {
    try {
      const xmlBase64 = Buffer.from(xmlFirmado).toString("base64");

      const payload = {
        clave: clave,
        fecha: new Date().toISOString(),
        emisor: {
          tipoIdentificacion: emisor.tipoIdentificacion,
          numeroIdentificacion: emisor.identificacion,
        },
        comprobanteXml: xmlBase64,
      };

      const response = await axios.post(this.url, payload, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        timeout: 30000,
      });

      return response.data;
    } catch (error) {
      const errorMsg =
        error instanceof Error ? error.message : "Unknow error";
      throw new Error(`Error at sent to Hacienda: ${errorMsg}`);
    }
  }
}