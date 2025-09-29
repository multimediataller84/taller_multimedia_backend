import { InvoiceRepository } from "../../repository/invoiceRepository.js";

export class GetInvoiceUseCase {
  constructor(private readonly invoiceRepository: InvoiceRepository) {}

  async execute(uuid: string) {
    return await this.invoiceRepository.get(uuid);
  }
}
