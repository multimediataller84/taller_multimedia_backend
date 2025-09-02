import { TaxRepository } from "../../repository/taxRepository.js";

export class DeleteTaxUseCase {
  constructor(private readonly taxRepository: TaxRepository) {}

  async execute(id: number) {
    return await this.taxRepository.delete(id);
  }
}
