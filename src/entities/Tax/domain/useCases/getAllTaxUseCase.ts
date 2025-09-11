import type { GetAllOptions } from "../../../../domain/types/TGetAllOptions.js";
import { TaxRepository } from "../../repository/taxRepository.js";

export class GetAllTaxUseCase {
  constructor(private readonly taxRepository: TaxRepository) {}

  async execute(options: GetAllOptions) {
    return await this.taxRepository.getAll(options);
  }
}
