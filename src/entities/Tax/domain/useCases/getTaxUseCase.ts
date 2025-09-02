import { TaxRepository } from "../../repository/taxRepository.js";

export class GetTaxUseCase {
  constructor(private readonly taxRepository: TaxRepository) {}

  async execute(id: number) {
    return await this.taxRepository.get(id);
  }
}