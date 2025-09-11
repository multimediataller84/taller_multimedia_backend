import { ProcessDataRepository } from "../../repository/processDataRepository.js";

export class PatchAllTaxUseCase {
  constructor(private readonly processDataRepository: ProcessDataRepository) {}

  async execute(file: Express.Multer.File) {
    return await this.processDataRepository.updateAll(file);
  }
}
