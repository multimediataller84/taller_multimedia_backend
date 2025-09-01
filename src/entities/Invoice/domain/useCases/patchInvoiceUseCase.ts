import { InvoiceRepository } from "../../repository/invoiceRepository.js";
import type { TInvoice } from "../types/TInvoice.js";

export class PatchInvoiceUseCase {
  constructor(private readonly invoiceRepository: InvoiceRepository) {}

  async execute(id: number, data: TInvoice) {
    return await this.invoiceRepository.patch(id, data);
  }
}
