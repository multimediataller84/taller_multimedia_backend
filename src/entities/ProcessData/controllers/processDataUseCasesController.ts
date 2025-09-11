import { ProcessDataRepository } from "../repository/processDataRepository.js";
import { PatchAllTaxUseCase } from "../domain/useCases/patchAllTaxUseCase.js";

export class ProcessDataUseCasesController {
  updateAll: PatchAllTaxUseCase;

  constructor(private readonly repository: ProcessDataRepository) {
    this.updateAll = new PatchAllTaxUseCase(this.repository);
  }
}
