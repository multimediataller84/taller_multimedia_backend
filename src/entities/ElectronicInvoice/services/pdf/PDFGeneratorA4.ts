import PDFDocument from "pdfkit";
import type { TElectronicInvoiceJSON } from "../../domain/types/TElectronicInvoiceJSON.js";
import { GeneratePDF } from "../../domain/abstract/abstractClassPDF.js";

import * as idConv from "../../utils/codeIDNumberConverter.js";
import * as payCode from "../../utils/codePaymentMethodConverter.js";
import * as payLang from "../../utils/paymentMethodLangConverter.js";

function toIdTypeLabel(code: any): string {
  try {
    return (
      (idConv as any).toLabel?.(code) ||
      (idConv as any).codeIDNumberConverter?.(code) ||
      (idConv as any).idTypeToLabel?.(code) ||
      String(code ?? "")
    );
  } catch {
    return String(code ?? "");
  }
}

function toPaymentMethodLabel(code: any): string {
  try {
    const mapped =
      (payLang as any).paymentMethodLangConverter?.(code) ||
      (payLang as any).toLabel?.(code) ||
      (payCode as any).toLabel?.(code) ||
      (payCode as any).codePaymentMethodConverter?.(code);
    return mapped ?? String(code ?? "");
  } catch {
    return String(code ?? "");
  }
}

function fmtCRC(n: number | string | null | undefined) {
  const v = Number(n ?? 0);
  return v.toLocaleString("es-CR", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function safeStr(v: any) {
  return v == null ? "" : String(v);
}

export class PDFGeneratorA4 extends GeneratePDF {
  constructor(readonly invoice: TElectronicInvoiceJSON) {
    super(invoice);
  }

  async generate(): Promise<Buffer> {
    const doc: PDFKit.PDFDocument = new PDFDocument({
      size: "A4",                    // A4 portrait
      margins: { top: 36, left: 40, right: 40, bottom: 36 },
    });

    const chunks: Buffer[] = [];
    doc.on("data", (chunk) => chunks.push(chunk));
    const endPromise = new Promise<Buffer>((resolve) => {
      doc.on("end", () => resolve(Buffer.concat(chunks)));
    });

    this.addHeader(doc);
    this.addIssuerAndReceiver(doc);
    this.addDetails(doc);
    this.addOrderCondition(doc);
    this.addTotals(doc);
    this.addFooter(doc);

    doc.end();
    return endPromise;
  }

  protected addHeader(doc: PDFKit.PDFDocument) {
    const { consecutivo, codigoActividad, emisor, fechaEmision, clave } = this.invoice;

    const startY = doc.y;
    doc
      .font("Helvetica-Bold").fontSize(14)
      .text(safeStr(emisor?.nombre), { align: "center" })
      .moveDown(0.25)
      .font("Helvetica").fontSize(10)
      .text(safeStr(emisor?.nombreComercial ?? ""), { align: "center" })
      .text(`Cédula (${toIdTypeLabel(emisor?.tipoIdentificacion)}): ${safeStr(emisor?.identificacion)}`, { align: "center" })
      .text(`Actividad Económica: ${safeStr(codigoActividad)}`, { align: "center" })
      .text(safeStr(emisor?.direccion ?? ""), { align: "center" })
      .text(`Tel: +506 ${safeStr(emisor?.telefono)}`, { align: "center" })
      .text(`Email: ${safeStr(emisor?.email)}`, { align: "center" });

    doc.moveDown(0.6);

    doc
      .font("Helvetica-Bold").fontSize(12)
      .text(`FACTURA ELECTRÓNICA`, { align: "center" })
      .moveDown(0.15)
      .font("Helvetica")
      .text(`Consecutivo: ${safeStr(consecutivo)}`, { align: "center" })
      .text(`Fecha de emisión: ${safeStr(fechaEmision)}`, { align: "center" });

    if (clave) {
      doc.moveDown(0.15).fontSize(8).fillColor("#666")
         .text(`Clave: ${clave}`, { align: "center" })
         .fillColor("#000");
    }

    doc.moveTo(40, startY + 110).lineTo(doc.page.width - 40, startY + 110).stroke();
    doc.moveDown(0.5);
  }

  protected addIssuerAndReceiver(doc: PDFKit.PDFDocument) {
    const { receptor, emisor } = this.invoice;

    const leftX = 40;
    const midX  = doc.page.width / 2 + 10;

    // Datos del cliente
    doc
      .fontSize(10).font("Helvetica-Bold")
      .text("Datos del Cliente", leftX, doc.y + 8, { underline: true })
      .moveDown(0.25)
      .font("Helvetica")
      .text(`Nombre: ${safeStr(receptor?.nombre)}`, leftX)
      .text(`Identificación (${toIdTypeLabel(receptor?.tipoIdentificacion)}): ${safeStr(receptor?.identificacion)}`, leftX)
      .text(`Teléfono: ${safeStr(receptor?.telefono)}`, leftX)
      .text(`Correo: ${safeStr(receptor?.email)}`, leftX)
      .text(`Provincia: ${safeStr(receptor?.provincia_id)}  Cantón: ${safeStr(receptor?.canton_id)}  Distrito: ${safeStr(receptor?.distrito_id)}`, leftX);

    // Datos del emisor (resumen, por si se requiere duplicado)
    const yTop = doc.y - 72; // sube un poco el bloque derecho
    doc
      .font("Helvetica-Bold")
      .text("Emisor", midX, yTop, { underline: true })
      .moveDown(0.25)
      .font("Helvetica")
      .text(`Nombre: ${safeStr(emisor?.nombre)}`, midX)
      .text(`Cédula (${toIdTypeLabel(emisor?.tipoIdentificacion)}): ${safeStr(emisor?.identificacion)}`, midX)
      .text(`Email: ${safeStr(emisor?.email)}`, midX);

    doc.moveDown(0.5);
  }

 protected addDetails(doc: PDFKit.PDFDocument) {
  type Col = { label: string; x: number; w: number; align?: "left"|"center"|"right" };

  const { detalles = [] } = this.invoice;

  const headers = [
    { label: "Cód",         x: 40,  w: 40,  align: "left"  },
    { label: "Descripción", x: 90,  w: 170, align: "left"  },
    { label: "CABYS",       x: 265, w: 70,  align: "left"  },
    { label: "Unidad",      x: 340, w: 60,  align: "left"  },
    { label: "Cant",        x: 405, w: 40,  align: "right" },
    { label: "P.Unit",      x: 450, w: 70,  align: "right" },
    { label: "IVA",         x: 525, w: 40,  align: "right" },
    { label: "Total",       x: 570, w: 70,  align: "right" },
  ] as const satisfies Readonly<[Col, Col, Col, Col, Col, Col, Col, Col]>;

  const [colCod, colDesc, colCabys, colUni, colCant, colPU, colIVA, colTotal] = headers;

  const tableTop = doc.y;

  // Encabezados
  doc.fontSize(9).font("Helvetica-Bold");
  headers.forEach((h) => {
    doc.text(h.label, h.x, tableTop, { width: h.w, align: h.align ?? "left" });
  });
  doc.moveTo(40, tableTop + 15).lineTo(700, tableTop + 15).stroke();

  let y = tableTop + 25;
  doc.font("Helvetica").fontSize(9);

  const fmt2 = (n: number) => (Number.isFinite(n) ? n.toFixed(2) : "0.00");
  const fmt0 = (n: number) => (Number.isFinite(n) ? n.toFixed(0) : "0");

  for (const raw of detalles as any[]) {
    const codigo         = String(raw?.codigoComercial?.codigo ?? "");
    const descripcion    = String(raw?.descripcion ?? "");
    const cabys          = String(raw?.impuesto?.codigoCABYS ?? raw?.cabys ?? "");
    const unidad         = String(raw?.unidadMedida ?? raw?.unidad ?? "Sp");
    const cantidad       = Number(raw?.cantidad ?? 0);
    const precioUnitario = Number(raw?.precioUnitario ?? 0);
    const tarifaIVA      = Number(raw?.impuesto?.tarifa ?? 0);
    const totalLinea     = cantidad * precioUnitario * (1 + (tarifaIVA > 0 ? tarifaIVA : 0) / 100);

    const descHeight = doc.heightOfString(descripcion, { width: colDesc.w });

    doc.text(codigo,                 colCod.x,   y, { width: colCod.w,   align: colCod.align ?? "left"  });
    doc.text(descripcion,            colDesc.x,  y, { width: colDesc.w,  align: colDesc.align ?? "left" });
    doc.text(cabys,                  colCabys.x, y, { width: colCabys.w, align: colCabys.align ?? "left" });
    doc.text(unidad,                 colUni.x,   y, { width: colUni.w,   align: colUni.align ?? "left"  });
    doc.text(fmt0(cantidad),         colCant.x,  y, { width: colCant.w,  align: colCant.align ?? "right" });
    doc.text(fmt2(precioUnitario),   colPU.x,    y, { width: colPU.w,    align: colPU.align ?? "right"  });
    doc.text(`${fmt0(tarifaIVA)}%`,  colIVA.x,   y, { width: colIVA.w,   align: colIVA.align ?? "right" });
    doc.text(fmt2(totalLinea),       colTotal.x, y, { width: colTotal.w, align: colTotal.align ?? "right" });

    y += Math.max(descHeight, 18);

    // Salto de página
    if (y > 520) {
      doc.addPage({ size: "A4", layout: "landscape", margins: { top: 40, left: 40, right: 40, bottom: 40 } });
      y = 60;

      // Reimprime headers
      doc.fontSize(9).font("Helvetica-Bold");
      headers.forEach((h) => {
        doc.text(h.label, h.x, y, { width: h.w, align: h.align ?? "left" });
      });
      doc.moveTo(40, y + 15).lineTo(700, y + 15).stroke();
      y += 25;
      doc.font("Helvetica").fontSize(9);
    }
  }

  doc.moveTo(40, y + 5).lineTo(700, y + 5).stroke();
  doc.moveDown(1);
}

  protected addOrderCondition(doc: PDFKit.PDFDocument) {
    const { condicionVenta, medioPago, moneda } = this.invoice;

    doc
      .moveDown(0.4)
      .fontSize(10)
      .font("Helvetica-Bold")
      .text("Condiciones de Venta", 40, doc.y, { underline: true })
      .moveDown(0.15)
      .font("Helvetica")
      .text(`Condición: ${safeStr(condicionVenta)}`, 40)
      .text(`Medio de Pago: ${toPaymentMethodLabel(medioPago)} (${safeStr(medioPago)})`, 40)
      .text(`Moneda: ${safeStr(moneda ?? "CRC")}`, 40)
      .moveDown(0.5);
  }

  protected addTotals(doc: PDFKit.PDFDocument) {
    const { detalles, moneda } = this.invoice;

    let subtotal = 0;
    let descuentos = 0;
    let impuesto = 0;

    (detalles || []).forEach((item: any) => {
      const cant = Number(item?.cantidad ?? 0);
      const pu   = Number(item?.precioUnitario ?? 0);
      const desc = Number(item?.descuento ?? 0);
      const pct  = Number(item?.impuesto?.tarifa ?? 0);

      const bruto = cant * pu;
      const neto = Math.max(bruto - desc, 0);
      const iva = neto * (pct / 100);

      subtotal += neto;
      descuentos += desc;
      impuesto += iva;
    });

    const total = subtotal + impuesto;

    const rightBlockX = doc.page.width - 260;
    const lineY = doc.y + 6;

    doc
      .font("Helvetica-Bold").fontSize(11)
      .text("Totales", rightBlockX, doc.y, { underline: true });

    doc.moveDown(0.2).font("Helvetica").fontSize(10);
    const lblW = 110, valW = 120;

    doc.text("Subtotal:", rightBlockX, doc.y + 4, { width: lblW, align: "right" });
    doc.text(`${fmtCRC(subtotal)} ${this.invoice.moneda ?? "CRC"}`, rightBlockX + lblW + 10, doc.y, { width: valW, align: "right" });

    doc.text("Descuentos:", rightBlockX, doc.y + 16, { width: lblW, align: "right" });
    doc.text(`${fmtCRC(descuentos)} ${this.invoice.moneda ?? "CRC"}`, rightBlockX + lblW + 10, doc.y, { width: valW, align: "right" });

    doc.text("Impuesto (IVA):", rightBlockX, doc.y + 16, { width: lblW, align: "right" });
    doc.text(`${fmtCRC(impuesto)} ${this.invoice.moneda ?? "CRC"}`, rightBlockX + lblW + 10, doc.y, { width: valW, align: "right" });

    doc
      .moveTo(rightBlockX, doc.y + 22)
      .lineTo(rightBlockX + lblW + valW + 10, doc.y + 22)
      .stroke();

    doc.font("Helvetica-Bold").text("TOTAL:", rightBlockX, doc.y + 6, { width: lblW, align: "right" });
    doc.text(`${fmtCRC(total)} ${this.invoice.moneda ?? "CRC"}`, rightBlockX + lblW + 10, doc.y, { width: valW, align: "right" });

    doc.moveDown(1);
  }

  protected addFooter(doc: PDFKit.PDFDocument) {
    const y = doc.page.height - 48;
    doc
      .fontSize(8)
      .fillColor("#666")
      .text(
        "Documento generado electrónicamente conforme a la normativa de Hacienda CR.",
        40, y, { align: "center", width: doc.page.width - 80 }
      )
      .text(
        "Este comprobante no requiere firma manuscrita.",
        40, y + 12, { align: "center", width: doc.page.width - 80 }
      )
      .fillColor("#000");
  }
}
