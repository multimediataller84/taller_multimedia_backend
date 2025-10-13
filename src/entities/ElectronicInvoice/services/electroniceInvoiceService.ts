import { config } from "../../../utilities/config.js";
import { invoiceValidator } from "../utils/invoiceValidator.js";
import { DigitalSign } from "./digitalSign.js";
import { ElectroniceInvoiceXML } from "./invoiceXML.js";
import { SendHacienda } from "./sendHacienda.js";
import fs from "fs/promises";
/*
export async function facturar() {
  try {

    if (!invoiceValidator(jsonTest)) {
      throw "undefined";
    }

    const generator = new ElectroniceInvoiceXML(jsonTest);
    const { xml, clave } = generator.generarXML();

    const signer = new DigitalSign(
      config.CERTIFICATE_PATH,
      config.CERTIFICATE_PASSWORD
    );
    const { xmlFirmado, firma } = await signer.signDocument(xml);

    const sender = new SendHacienda(
      config.HACIENDA_API_SANDBOX,
      config.ENVIROMENT
    );
    const haciendaResponse = await sender.sendReceipt(
      clave,
      xmlFirmado,
      jsonTest.emisor
    );

    await fs.writeFile(`./invoices/${clave}.xml`, xmlFirmado);

    return {
      success: true,
      clave: clave,
      mensaje: "Factura procesada exitosamente",
      respuestaHacienda: haciendaResponse,
    };
  } catch (error) {
    console.error("Error al procesar factura:", error);
    const errorMsg =
      error instanceof Error ? error.message : "Error desconocido";
    throw {
      success: false,
      error: errorMsg,
    };
  }
}
*/