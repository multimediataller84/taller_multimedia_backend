import { InvoiceRepository } from "../../repository/invoiceRepository.js";

export class GetInvoiceUseCase {
  constructor(private readonly invoiceRepository: InvoiceRepository) {}

  async execute(id: number) {
    return await this.invoiceRepository.get(id);
  }
}
