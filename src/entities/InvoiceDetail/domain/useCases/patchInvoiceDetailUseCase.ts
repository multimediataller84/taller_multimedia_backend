import { InvoiceDetailRepository } from "../../repository/invoiceDetailRepository.js";
import type { TInvoiceDetail } from "../types/TInvoiceDetail.js";

export class PatchInvoiceDetailUseCase {
  constructor(private readonly invoiceDetailRepository: InvoiceDetailRepository) {}

  async execute(id: number, data: TInvoiceDetail) {
    return await this.invoiceDetailRepository.patch(id, data);
  }
}
