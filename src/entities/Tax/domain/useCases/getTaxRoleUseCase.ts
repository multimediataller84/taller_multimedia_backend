import { TaxRepository } from "../../repository/taxRepository.js";

export class GetAllTaxUseCase {
  constructor(private readonly taxRepository: TaxRepository) {}

  async execute() {
    return await this.taxRepository.getAll();
  }
}
