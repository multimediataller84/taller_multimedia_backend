import { InvoiceRepository } from "../../repository/invoiceRepository.js";
import type { TInvoice } from "../types/TInvoice.js";
export class PostInvoiceUseCase {
  constructor(private readonly invoiceRepository: InvoiceRepository) {}

  async execute(data: TInvoice) {
   if (!data.products || data.products.length === 0) {
      throw new Error("Invoice must have products");
    }

    return await this.invoiceRepository.post(data);
  }
}
