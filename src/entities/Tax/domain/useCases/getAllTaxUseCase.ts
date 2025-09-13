import type { TGetAllOptions } from "../../../../domain/types/TGetAllOptions.js";
import { TaxRepository } from "../../repository/taxRepository.js";

export class GetAllTaxUseCase {
  constructor(private readonly taxRepository: TaxRepository) {}

  async execute(options: TGetAllOptions) {
    return await this.taxRepository.getAll(options);
  }
}
