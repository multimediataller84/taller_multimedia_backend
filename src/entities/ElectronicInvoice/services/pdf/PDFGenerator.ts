import PDFDocument from "pdfkit";
import type { TElectronicInvoiceJSON } from "../../domain/types/TElectronicInvoiceJSON.js";
import { GeneratePDF } from "../../domain/abstract/abstractClassPDF.js";

export class PDFGenerator extends GeneratePDF {
  constructor(readonly invoice: TElectronicInvoiceJSON) {
    super(invoice);
  }

  async generate(): Promise<Buffer> {
    const baseHeight = 400;
    const lineHeight = 22;
    const detalles = this.invoice.detalles || [];
    const dynamicHeight = baseHeight + detalles.length * lineHeight;

    const doc: PDFKit.PDFDocument = new PDFDocument({
      size: [226.77, dynamicHeight],
      margins: { top: 10, left: 10, right: 10, bottom: 10 },
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
      .fontSize(11)
      .font("Helvetica-Bold")
      .text(emisor.nombre, { align: "center" })
      .moveDown(0.3)
      .fontSize(8)
      .font("Helvetica")
      .text(emisor.nombreComercial, { align: "center" })
      .text(`Cédula Jurídica: ${emisor.identificacion ?? "NA"}`, {
        align: "center",
      })
      .text(`Actividad Económica: ${codigoActividad}`, { align: "center" })
      .text(emisor.direccion, { align: "center" })
      .text(`Tel: +506 ${emisor.telefono}`, { align: "center" })
      .text(`Email: ${emisor.email}`, { align: "center" })
      .moveDown(0.5)
      .text(
        "-----------------------------------------------------------------------------",
        { align: "center" }
      );

    doc
      .moveDown(0.3)
      .fontSize(8)
      .font("Helvetica")
      .text(`Factura N°: ${id}`, { align: "left" })
      .text(`Consecutivo°: ${consecutivo}`, { align: "left" })
      .text(`Fecha: ${this.invoice.fechaEmision}`)
      .moveDown(0.3)
      .font("Helvetica")
      .text(
        "-----------------------------------------------------------------------------",
        { align: "center" }
      );
  }

  protected addIssuerAndReceiver(doc: PDFKit.PDFDocument) {
    const { receptor } = this.invoice;

    doc
      .fontSize(8)
      .font("Helvetica")
      .text(`Cliente: ${receptor.nombre}`)
      .text(`Tipo identificacion: ${receptor.tipoIdentificacion}`)
      .text(`Cédula: ${receptor.identificacion}`)
      .text(`Teléfono: ${receptor.telefono}`)
      .text(`Correo: ${receptor.email}`)
      .text(`Provincia: ${receptor.provincia_id}`)
      .text(`Canton: ${receptor.canton_id}`)
      .text(`Distrito: ${receptor.distrito_id}`)
      .moveDown(0.3)
      .text(
        "-----------------------------------------------------------------------------",
        { align: "center" }
      );
  }

  protected addDetails(doc: PDFKit.PDFDocument) {
    const { detalles } = this.invoice;

    doc
      .moveDown(0.3)
      .fontSize(8)
      .font("Helvetica-Bold")
      .text("Cód", 10)
      .moveUp(1)
      .text("Descripción", 45)
      .moveUp(1)
      .text("Cant", 100)
      .moveUp(1)
      .text("P.Unit", 130)
      .moveUp(1)
      .text("IVA", 165)
      .moveUp(1)
      .text("Total", 190)
      .moveUp(1)
      .font("Helvetica");

    doc
      .moveDown(1.2)
      .text(
        "-----------------------------------------------------------------------------",
        10,
        doc.y,
        { align: "center" }
      );

    let y = doc.y;
    const lineHeight = 10;

    detalles.forEach((item: any) => {
      const totalLinea =
        item.cantidad * item.precioUnitario * (1 + item.impuesto.tarifa / 100);

      doc.fontSize(7);

      doc.text(
        `${String(item.codigoComercial.codigo).substring(0, 6)}`,
        10,
        y,
        { width: 30 }
      );
      doc.text(item.descripcion, 45, y, { width: 60 });
      doc.text(`${item.cantidad}`, 102, y, { width: 15, align: "right" });
      doc.text(`${item.precioUnitario.toFixed(0)}`, 125, y, {
        width: 25,
        align: "right",
      });
      doc.text(`${item.impuesto.tarifa}%`, 159, y, {
        width: 20,
        align: "right",
      });
      doc.text(`${totalLinea.toFixed(0)}`, 183, y, {
        width: 25,
        align: "right",
      });

      const alturaDescripcion = doc.heightOfString(item.descripcion, {
        width: 60,
      });

      y += Math.max(alturaDescripcion, lineHeight);
    });

    doc
      .fontSize(8)
      .text(
        "-----------------------------------------------------------------------------",
        10,
        y,
        { align: "center" }
      )
      .moveDown(0.2);
  }

  protected addOrderCondition(doc: PDFKit.PDFDocument) {
    const { condicionVenta, medioPago } = this.invoice;
    doc
      .text(`Condicion: ${condicionVenta}`)
      .text(`Medio de pago: ${medioPago}`)
      .moveDown(0.3)
      .text(
        "-----------------------------------------------------------------------------",
        { align: "center" }
      )
      .moveDown(0.2);
  }

  protected addTotals(doc: PDFKit.PDFDocument) {
    const { detalles, moneda } = this.invoice;

    const subtotal = detalles.reduce(
      (acc: number, item: any) => acc + item.cantidad * item.precioUnitario,
      0
    );

    const impuestosPorTarifa = detalles.reduce((acc: any, item: any) => {
      const tarifa = item.impuesto.tarifa;
      const subtotalItem = item.cantidad * item.precioUnitario;
      const impuestoItem = subtotalItem * (tarifa / 100);

      if (!acc[tarifa]) {
        acc[tarifa] = {
          tarifa: tarifa,
          subtotal: 0,
          impuesto: 0,
        };
      }

      acc[tarifa].subtotal += subtotalItem;
      acc[tarifa].impuesto += impuestoItem;

      return acc;
    }, {});

    const totalImpuesto = Object.values(impuestosPorTarifa).reduce(
      (acc: number, grupo: any) => acc + grupo.impuesto,
      0
    );

    const total = subtotal + totalImpuesto;

    const tarifasOrdenadas = Object.values(impuestosPorTarifa).sort(
      (a: any, b: any) => a.tarifa - b.tarifa
    );

    doc
      .font("Helvetica-Bold")
      .fontSize(9)
      .text("Desglose de Impuestos: ")
      .font("Helvetica")
      .moveDown(0.2);

    tarifasOrdenadas.forEach((grupo: any) => {
      doc
        .fontSize(8)
        .text(
          `IVA ${grupo.tarifa}%:  Total: ${grupo.impuesto.toFixed(
            2
          )} ${moneda}`,
          { align: "right" }
        );
    });

    doc
      .font("Helvetica")
      .fontSize(8)
      .text(`Subtotal:  ${subtotal.toFixed(2)} ${moneda}`, { align: "right" })
      .moveDown(0.2)
      .text(`IVA:       ${totalImpuesto.toFixed(2)} ${moneda}`, {
        align: "right",
      })
      .moveDown(0.2)
      .font("Helvetica-Bold")
      .text(`TOTAL:     ${total.toFixed(2)} ${moneda}`, { align: "right" })
      .font("Helvetica")
      .moveDown(0.3)
      .text(
        "-----------------------------------------------------------------------------",
        { align: "center" }
      );
  }

  protected addFooter(doc: PDFKit.PDFDocument) {
    doc
      .fontSize(7)
      .fillColor("gray")
      .text("Documento generado electrónicamente", { align: "center" })
      .text("conforme a la normativa de Hacienda CR", { align: "center" })
      .moveDown(0.3)
      .fillColor("black");
  }
}
