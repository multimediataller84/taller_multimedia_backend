import { TaxRepository } from "../../repository/taxRepository.js";
import type { TTax } from "../types/TTax.js";

export class PatchTaxUseCase {
  constructor(private readonly taxRepository: TaxRepository) {}

  async execute(data: TTax) {
    return await this.taxRepository.patch(data);
  }
}
