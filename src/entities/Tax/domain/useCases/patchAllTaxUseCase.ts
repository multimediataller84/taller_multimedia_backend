import { TaxRepository } from "../../repository/taxRepository.js";

export class PatchAllTaxUseCase {
  constructor(private readonly taxRepository: TaxRepository) {}

  async execute(file: Express.Multer.File) {
    return await this.taxRepository.updateAll(file);
  }
}
