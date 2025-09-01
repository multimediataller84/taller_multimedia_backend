import { InvoiceRepository } from "../../repository/invoiceRepository.js";

export class GetAllInvoiceUseCase {
  constructor(private readonly invoiceRepository: InvoiceRepository) {}

  async execute() {
    return await this.invoiceRepository.getAll();
  }
}
