import { InvoiceRepository } from "../../repository/invoiceRepository.js";

export class DeleteInvoiceUseCase {
  constructor(private readonly invoiceRepository: InvoiceRepository) {}

  async execute(id: number) {
    return await this.invoiceRepository.delete(id);
  }
}
