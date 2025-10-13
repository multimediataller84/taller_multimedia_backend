import type { PDFType } from "../../domain/types/PDFType.js";
import type { TElectronicInvoiceJSON } from "../../domain/types/TElectronicInvoiceJSON.js";
import { PDFGenerator } from "./PDFGenerator.js";
import { PDFGeneratorA4 } from "./PDFGeneratorA4.js";

export class PDFFactory {
  static createPDF(type: PDFType, invoice: TElectronicInvoiceJSON) {
    switch (type) {
      case "TICKET":
        return new PDFGenerator(invoice);
      case "A4":
        return new PDFGeneratorA4(invoice);
    }
  }
}
