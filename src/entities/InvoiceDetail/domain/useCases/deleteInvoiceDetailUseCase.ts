import { InvoiceDetailRepository } from "../../repository/invoiceDetailRepository.js";

export class DeleteInvoiceDetailUseCase {
  constructor(private readonly invoiceDetailRepository: InvoiceDetailRepository) {}

  async execute(id: number) {
    return await this.invoiceDetailRepository.delete(id);
  }
}
