import { CreditStatusRepository } from "../repository/creditStatusRepository.js";
import { GetCreditStatusUseCase } from "../domain/useCases/getCreditStatusUseCase.js";
import { GetAllCreditStatusUseCase } from "../domain/useCases/getAllCreditStatusUseCase.js";
import { PostCreditStatusUseCase } from "../domain/useCases/postCreditStatusUseCase.js";
import { PatchCreditStatusUseCase } from "../domain/useCases/patchCreditStatusUseCase.js";
import { DeleteCreditStatusUseCase } from "../domain/useCases/deleteCreditStatusUseCase.js";

export class CreditStatusUseCasesController {
  get: GetCreditStatusUseCase;
  getAll: GetAllCreditStatusUseCase;
  post: PostCreditStatusUseCase;
  patch: PatchCreditStatusUseCase;
  delete: DeleteCreditStatusUseCase;

  constructor(private readonly repository: CreditStatusRepository) {
    this.get = new GetCreditStatusUseCase(this.repository);
    this.getAll = new GetAllCreditStatusUseCase(this.repository);
    this.post = new PostCreditStatusUseCase(this.repository);
    this.patch = new PatchCreditStatusUseCase(this.repository);
    this.delete = new DeleteCreditStatusUseCase(this.repository);
  }
}
