import { InvoiceRepository } from "../../repository/invoiceRepository.js";

export class GetPdfInvoiceUseCase {
  constructor(private readonly invoiceRepository: InvoiceRepository) {}

  async execute(name: string) {
    return await this.invoiceRepository.getPdf(name);
  }
}
