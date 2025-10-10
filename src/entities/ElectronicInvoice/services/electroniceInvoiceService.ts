import { config } from "../../../utilities/config.js";
import { invoiceValidator } from "../utils/invoiceValidator.js";
import { DigitalSign } from "./digitalSign.js";
import { ElectroniceInvoiceXML } from "./invoiceXML.js";
import { SendHacienda } from "./sendHacienda.js";
import fs from "fs/promises";
import { jsonTest } from "../utils/testInvoice.js";

const toNum = (x: any, def = 0) => {
  const n = Number(x);
  return Number.isFinite(n) ? n : def;
};
const clampNonNeg = (n: number) => (n < 0 ? 0 : n);

async function resolveTaxPercentage(detalle: any): Promise<number> {
  if (detalle?.impuesto?.tarifa != null) {
    const p = Number(detalle.impuesto.tarifa);
    return Number.isFinite(p) ? p : 0;
  }

  if (detalle?.taxPercentage != null) {
    const p = Number(detalle.taxPercentage);
    return Number.isFinite(p) ? p : 0;
  }

  return 0;
}

async function enrichDetalle(detalle: any, idx: number) {
  const cantidad = clampNonNeg(toNum(detalle.cantidad, 0));
  const precioUnitario = clampNonNeg(toNum(detalle.precioUnitario, 0));
  const descuento = clampNonNeg(toNum(detalle.descuento, 0));
  const ivaDevuelto = clampNonNeg(toNum(detalle.ivaDevuelto, 0));
  const otrosCargos = clampNonNeg(toNum(detalle.otrosCargos, 0));

  const porcentaje = await resolveTaxPercentage(detalle);
  const hasTax = porcentaje > 0;

  const impuesto = hasTax
    ? {
        codigo: detalle?.impuesto?.codigo ?? "01",
        codigoTarifa: detalle?.impuesto?.codigoTarifa ?? "08",
        tarifa: porcentaje,
        exoneracion: detalle?.impuesto?.exoneracion ?? null,
      }
    : null;

  return {
    cantidad,
    unidadMedida: detalle?.unidadMedida ?? "Sp",
    descripcion: detalle?.descripcion ?? `Línea ${idx + 1}`,
    precioUnitario,
    descuento,
    naturalezaDescuento: detalle?.naturalezaDescuento ?? (descuento > 0 ? "Descuento" : undefined),
    impuesto,
    ivaDevuelto,
    otrosCargos,

    codigoComercial: detalle?.codigoComercial ?? null,

    taxPercentage: porcentaje,
    taxExempt: !hasTax,
  };
}

async function enrichInvoice(raw: any) {
  const detallesEnriquecidos = [];
  for (let i = 0; i < (raw?.detalles?.length ?? 0); i++) {
    const d = raw.detalles[i];
    detallesEnriquecidos.push(await enrichDetalle(d, i));
  }

  return {
    ...raw,
    codigoActividad: String(raw?.codigoActividad ?? "000000"),
    consecutivo: String(raw?.consecutivo ?? "00100001000000001"),
    moneda: raw?.moneda ?? "CRC",

    emisor: { ...raw.emisor },
    receptor: { ...raw.receptor },

    condicionVenta: raw?.condicionVenta ?? "01",
    medioPago: raw?.medioPago ?? "01",

    detalles: detallesEnriquecidos,
  };
}

export async function facturar() {
  try {
    const input = jsonTest;

    if (!invoiceValidator(input)) {
      throw "undefined";
    }

    const enriched = await enrichInvoice(input);

    const generator = new ElectroniceInvoiceXML(enriched);
    const { xml, clave } = generator.generarXML();

    const signer = new DigitalSign(
      config.CERTIFICATE_PATH,
      config.CERTIFICATE_PASSWORD
    );
    const { xmlFirmado /*, firma*/ } = await signer.signDocument(xml);

    const sender = new SendHacienda(
      config.HACIENDA_API_SANDBOX,
      config.ENVIROMENT
    );
    const haciendaResponse = await sender.sendReceipt(
      clave,
      xmlFirmado,
      enriched.emisor
    );

    await fs.writeFile(`./invoices/${clave}.xml`, xmlFirmado);

    return {
      success: true,
      clave,
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
