import PDFDocument from "pdfkit";
export class PDFGenerator {
  constructor(readonly invoice: any) {
    console.log(this.invoice);
  }

  async generate(): Promise<Buffer> {
    const baseHeight = 350;
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
    this.addOrderCondition(doc)
    this.addTotals(doc);
    this.addFooter(doc);

    doc.end();

    return endPromise;
  }

  private addHeader(doc: PDFKit.PDFDocument) {
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

  private addIssuerAndReceiver(doc: PDFKit.PDFDocument) {
    const { receptor } = this.invoice;

    doc
      .fontSize(8)
      .font("Helvetica")
      .text(`Cliente: ${receptor.nombre}`)
      .text(`Tipo identificacion: ${receptor.tipoIdentificacion}`)
      .text(`Cédula: ${receptor.identificacion}`)
      .text(`Teléfono: ${receptor.telefono}`)
      .text(`Correo: ${receptor.email}`)
      .moveDown(0.3)
      .text(
        "-----------------------------------------------------------------------------",
        { align: "center" }
      );
  }

  private addDetails(doc: PDFKit.PDFDocument) {
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

  private addOrderCondition(doc: PDFKit.PDFDocument) {
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

  private addTotals(doc: PDFKit.PDFDocument) {
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
      .fontSize(8)
      .text(`Subtotal:  ${subtotal.toFixed(2)} ${moneda}`)
      .moveDown(0.2)
      .text(`IVA:       ${totalImpuesto.toFixed(2)} ${moneda}`)
      .moveDown(0.2)
      .font("Helvetica-Bold")
      .text(`TOTAL:     ${totalGeneral.toFixed(2)} ${moneda}`)
      .font("Helvetica")
      .moveDown(0.3)
      .text(
        "-----------------------------------------------------------------------------",
        { align: "center" }
      );
  }

  private addFooter(doc: PDFKit.PDFDocument) {
    doc
      .fontSize(7)
      .fillColor("gray")
      .text("Documento generado electrónicamente", { align: "center" })
      .text("conforme a la normativa de Hacienda CR", { align: "center" })
      .moveDown(0.3)
      .fillColor("black");
  }
}
