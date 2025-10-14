import PDFDocument from "pdfkit";
import type { TElectronicInvoiceJSON } from "../../domain/types/TElectronicInvoiceJSON.js";
import { GeneratePDF } from "../../domain/abstract/abstractClassPDF.js";

export class PDFGeneratorA4 extends GeneratePDF{
  constructor(readonly invoice: TElectronicInvoiceJSON) {
    super(invoice)
  }

  async generate(): Promise<Buffer> {
    const doc: PDFKit.PDFDocument = new PDFDocument({
      size: "A4",
      layout: "landscape",
      margins: { top: 40, left: 40, right: 40, bottom: 40 },
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
    const { id, consecutivo, codigoActividad, emisor } = this.invoice;

    doc
      .fontSize(14)
      .font("Helvetica-Bold")
      .text(emisor.nombre, { align: "center" })
      .moveDown(0.3)
      .fontSize(10)
      .font("Helvetica")
      .text(emisor.nombreComercial ?? "", { align: "center" })
      .text(`Cédula Jurídica: ${emisor.identificacion ?? "NA"}`, {
        align: "center",
      })
      .text(`Actividad Económica: ${codigoActividad}`, { align: "center" })
      .text(emisor.direccion ?? "", { align: "center" })
      .text(`Tel: +506 ${emisor.telefono ?? "NA"}`, { align: "center" })
      .text(`Email: ${emisor.email ?? ""}`, { align: "center" })
      .moveDown(0.8)
      .font("Helvetica-Bold")
      .text(`FACTURA ELECTRÓNICA N°: ${consecutivo}`, { align: "center" })
      .moveDown(0.5)
      .font("Helvetica")
      .text(`Fecha de emisión: ${this.invoice.fechaEmision}`, {
        align: "center",
      })
      .moveDown(1);
  }

  protected addIssuerAndReceiver(doc: PDFKit.PDFDocument) {
    const { receptor } = this.invoice;

    doc
      .fontSize(10)
      .font("Helvetica-Bold")
      .text("Datos del Cliente", { underline: true })
      .moveDown(0.3)
      .font("Helvetica")
      .text(`Nombre: ${receptor.nombre}`)
      .text(
        `Identificación (${receptor.tipoIdentificacion}): ${receptor.identificacion}`
      )
      .text(`Teléfono: ${receptor.telefono}`)
      .text(`Correo: ${receptor.email}`)
      .moveDown(1);
  }

  protected addDetails(doc: PDFKit.PDFDocument) {
    const { detalles } = this.invoice;
    const tableTop = doc.y;

    const headers = [
      { label: "Cód", x: 40 },
      { label: "Descripción", x: 90 },
      { label: "CABYS", x: 260 },
      { label: "Unidad", x: 350 },
      { label: "Cant", x: 420 },
      { label: "P.Unit", x: 470 },
      { label: "IVA", x: 540 },
      { label: "Total", x: 600 },
    ];

    doc.fontSize(9).font("Helvetica-Bold");
    headers.forEach((h) => doc.text(h.label, h.x, tableTop));
    doc
      .moveTo(40, tableTop + 15)
      .lineTo(700, tableTop + 15)
      .stroke();

    let y = tableTop + 25;
    doc.font("Helvetica").fontSize(9);

    detalles.forEach((item: any) => {
      const totalLinea =
        item.cantidad * item.precioUnitario * (1 + item.impuesto.tarifa / 100);

      const descHeight = doc.heightOfString(item.descripcion, { width: 180 });

      doc.text(`${item.codigoComercial.codigo}`, 40, y, { width: 40 });
      doc.text(item.descripcion, 90, y, { width: 180 });
      doc.text(item.impuesto.codigoCABYS, 260, y, { width: 80 });
      doc.text(item.unidadMedida, 350, y, { width: 60 });
      doc.text(`${item.cantidad}`, 420, y, { width: 40, align: "left" });
      doc.text(`${item.precioUnitario.toFixed(2)}`, 470, y, {
        width: 60,
        align: "left",
      });
      doc.text(`${item.impuesto.tarifa.toFixed(0)}%`, 540, y, {
        width: 40,
        align: "left",
      });
      doc.text(`${totalLinea.toFixed(2)}`, 600, y, {
        width: 60,
        align: "left",
      });

      y += Math.max(descHeight, 18);
      if (y > 520) {
        doc.addPage({ size: "A4", layout: "landscape" });
        y = 60;
      }
    });

    doc
      .moveTo(40, y + 5)
      .lineTo(700, y + 5)
      .stroke();
    doc.moveDown(1);
  }

  protected addOrderCondition(doc: PDFKit.PDFDocument) {
    const { condicionVenta, medioPago } = this.invoice;

    doc
      .moveDown(0.5)
      .fontSize(10)
      .font("Helvetica-Bold")
      .text("Condiciones de Venta", { underline: true })
      .font("Helvetica")
      .text(`Condición: ${condicionVenta}`)
      .text(`Medio de Pago: ${medioPago}`)
      .moveDown(1);
  }

  protected addTotals(doc: PDFKit.PDFDocument) {
    const { detalles, moneda } = this.invoice;

    const subtotal = detalles.reduce(
      (acc: number, item: any) => acc + item.cantidad * item.precioUnitario,
      0
    );

    const totalImpuesto = detalles.reduce(
      (acc: number, item: any) =>
        acc +
        item.cantidad * item.precioUnitario * (item.impuesto.tarifa / 100),
      0
    );

    const totalGeneral = subtotal + totalImpuesto;

    doc
      .fontSize(10)
      .font("Helvetica-Bold")
      .text("Totales", 500, doc.y, { underline: true })
      .font("Helvetica")
      .text(`Subtotal:  ${subtotal.toFixed(2)} ${moneda}`, 500)
      .text(`IVA:       ${totalImpuesto.toFixed(2)} ${moneda}`, 500)
      .moveDown(0.2)
      .font("Helvetica-Bold")
      .text(`TOTAL:     ${totalGeneral.toFixed(2)} ${moneda}`, 500)
      .moveDown(1);
  }

  protected addFooter(doc: PDFKit.PDFDocument) {
    doc
      .moveDown(2)
      .fontSize(8)
      .fillColor("gray")
      .text(
        "Documento generado electrónicamente conforme a la normativa de Hacienda CR",
        {
          align: "center",
        }
      )
      .text("Este documento no requiere firma manuscrita.", { align: "center" })
      .fillColor("black");
  }
}
