import { InvoiceDetailRepository } from "../../repository/invoiceDetailRepository.js";

export class GetInvoiceDetailUseCase {
  constructor(private readonly invoiceDetailRepository: InvoiceDetailRepository) {}

  async execute(id: number) {
    return await this.invoiceDetailRepository.get(id);
  }
}
