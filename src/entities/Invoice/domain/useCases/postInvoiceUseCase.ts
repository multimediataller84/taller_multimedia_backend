import { InvoiceRepository } from "../../repository/invoiceRepository.js";
import type { TInvoice } from "../types/TInvoice.js";

export class PostInvoiceUseCase {
  constructor(private readonly invoiceRepository: InvoiceRepository) {}

  async execute(data: TInvoice) {
    return await this.invoiceRepository.post(data);
  }
}
