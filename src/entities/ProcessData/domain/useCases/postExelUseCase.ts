import { ProcessDataRepository } from "../../repository/processDataRepository.js";

export class PostExelUseCase {
  constructor(private readonly processDataRepository: ProcessDataRepository) {}

  async execute(file: Express.Multer.File) {
    return await this.processDataRepository.processExel(file);
  }
}
