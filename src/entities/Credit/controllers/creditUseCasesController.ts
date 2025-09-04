import { DeleteCreditUseCase } from "../domain/useCases/deleteCreditUseCase.js";
import { GetAllCreditUseCase } from "../domain/useCases/getAllCreditUseCase.js";
import { GetCreditUseCase } from "../domain/useCases/getCreditUseCase.js";
import { PatchCreditUseCase } from "../domain/useCases/patchCreditUseCase.js";
import { PostCreditUseCase } from "../domain/useCases/postCreditUseCase.js";
import { CreditRepository } from "../repository/creditRepository.js";

export class CreditUseCasesController {
  get: GetCreditUseCase;
  getAll: GetAllCreditUseCase;
  post: PostCreditUseCase;
  patch: PatchCreditUseCase;
  delete: DeleteCreditUseCase;

  constructor(private readonly repository: CreditRepository) {
    this.get = new GetCreditUseCase(this.repository);
    this.getAll = new GetAllCreditUseCase(this.repository);
    this.post = new PostCreditUseCase(this.repository);
    this.patch = new PatchCreditUseCase(this.repository);
    this.delete = new DeleteCreditUseCase(this.repository);
  }
}
