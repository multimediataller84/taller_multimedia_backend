import { InvoiceDetailRepository } from "../../repository/invoiceDetailRepository.js";

export class GetAllInvoiceDetailUseCase {
  constructor(private readonly invoiceDetailRepository: InvoiceDetailRepository) {}

  async execute() {
    return await this.invoiceDetailRepository.getAll();
  }
}
