import { InvoiceDetailRepository } from "../../repository/invoiceDetailRepository.js";
import type { TInvoiceDetail } from "../types/TInvoiceDetail.js";

export class PostInvoiceDetailUseCase {
  constructor(private readonly invoiceDetailRepository: InvoiceDetailRepository) {}

  async execute(data: TInvoiceDetail) {
    return await this.invoiceDetailRepository.post(data);
  }
}
