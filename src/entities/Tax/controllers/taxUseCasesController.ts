import { TaxRepository } from "../repository/taxRepository.js";
import { GetTaxUseCase } from "../domain/useCases/getTaxUseCase.js";
import { GetAllTaxUseCase } from "../domain/useCases/getTaxRoleUseCase.js";
import { PostTaxUseCase } from "../domain/useCases/postTaxUseCase.js";
import { PatchTaxUseCase } from "../domain/useCases/patchTaxUseCase.js";
import { DeleteTaxUseCase } from "../domain/useCases/deleteTaxUseCase.js";
import { PatchAllTaxUseCase } from "../domain/useCases/patchAllTaxUseCase.js";

export class TaxUseCasesController {
  get: GetTaxUseCase;
  getAll: GetAllTaxUseCase;
  post: PostTaxUseCase;
  patch: PatchTaxUseCase;
  delete: DeleteTaxUseCase;
  updateAll: PatchAllTaxUseCase;

  constructor(private readonly repository: TaxRepository) {
    this.get = new GetTaxUseCase(this.repository);
    this.getAll = new GetAllTaxUseCase(this.repository);
    this.post = new PostTaxUseCase(this.repository);
    this.patch = new PatchTaxUseCase(this.repository);
    this.delete = new DeleteTaxUseCase(this.repository);
    this.updateAll = new PatchAllTaxUseCase(this.repository);
  }
}
