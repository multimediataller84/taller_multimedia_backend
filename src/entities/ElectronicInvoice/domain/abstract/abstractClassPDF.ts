import type { TElectronicInvoiceJSON } from "../types/TElectronicInvoiceJSON.js";

export abstract class GeneratePDF {
  constructor(protected readonly invoice: TElectronicInvoiceJSON) {}

  abstract generate(): Promise<Buffer>;

  protected addHeader(doc: PDFKit.PDFDocument) {}
  protected addIssuerAndReceiver(doc: PDFKit.PDFDocument) {}
  protected addDetails(doc: PDFKit.PDFDocument) {}
  protected addOrderCondition(doc: PDFKit.PDFDocument) {}
  protected addTotals(doc: PDFKit.PDFDocument) {}
  protected addFooter(doc: PDFKit.PDFDocument) {}
}
