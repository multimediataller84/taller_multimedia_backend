import PDFDocument from "pdfkit";
export class PDFGenerator {
  constructor(readonly invoice: any) {}

  async generate(): Promise<Buffer> {
    const baseHeight = 300;
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
    this.addTotals(doc);
    this.addFooter(doc);

    doc.end();

    return endPromise;
  }

  private addHeader(doc: PDFKit.PDFDocument) {
    const { consecutivo, codigoActividad, emisor } = this.invoice;

    // doc.image("logo.png", 70, 10, { width: 80 });

    doc
      .fontSize(11)
      .font("Helvetica-Bold")
      .text(emisor.nombreComercial || emisor.nombre, { align: "center" })
      .moveDown(0.3)
      .fontSize(8)
      .font("Helvetica")
      .text(`Tramo La Maravilla S.A.`, { align: "center" })
      .text(`Cédula Jurídica: ${emisor.identificacion}`, { align: "center" })
      .text(`Actividad Económica: ${codigoActividad}`, { align: "center" })
      .text(emisor.direccion, { align: "center" })
      .text(`Tel: +506 ${emisor.telefono}`, { align: "center" })
      .text(`Email: ${emisor.email}`, { align: "center" })
      .moveDown(0.5);

    doc
      .fontSize(9)
      .font("Helvetica-Bold")
      .text(`Factura N°: ${consecutivo}`, { align: "center" })
      .moveDown(0.3)
      .font("Helvetica")
      .text(
        "-------------------------------------------------------------------",
        { align: "center" }
      );
  }

  private addIssuerAndReceiver(doc: PDFKit.PDFDocument) {
    const { receptor } = this.invoice;

    doc
      .fontSize(8)
      .font("Helvetica-Bold")
      .text("Cliente:")
      .font("Helvetica")
      .text(receptor.nombre)
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
      .text("Cód", 15)
      .moveUp(1)
      .text("Descripción", 40)
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

    detalles.forEach((item: any) => {
      const totalLinea =
        item.cantidad * item.precioUnitario * (1 + item.impuesto.tarifa / 100);

      doc
        .fontSize(7)
        .text(
          `${item.codigoComercial.codigo}  ${item.descripcion.substring(
            0,
            25
          )}  ${item.cantidad}  ${item.precioUnitario.toFixed(0)}  ${
            item.impuesto.tarifa
          }%  ${totalLinea.toFixed(0)}`
        )
        .moveDown(0.3);
    });

    doc
      .fontSize(8)
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
      .text(`IVA:       ${totalImpuesto.toFixed(2)} ${moneda}`)
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
