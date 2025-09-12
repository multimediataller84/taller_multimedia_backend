import { ProcessDataRepository } from "../repository/processDataRepository.js";
import { PatchAllTaxUseCase } from "../domain/useCases/patchAllTaxUseCase.js";
import { PostExelUseCase } from "../domain/useCases/postExelUseCase.js";

export class ProcessDataUseCasesController {
  updateAll: PatchAllTaxUseCase;
  processExel: PostExelUseCase;

  constructor(private readonly repository: ProcessDataRepository) {
    this.updateAll = new PatchAllTaxUseCase(this.repository);
    this.processExel = new PostExelUseCase(this.repository);
  }
}
