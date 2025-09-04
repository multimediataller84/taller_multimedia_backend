import { DeleteCreditPaymentUseCase } from "../domain/useCases/deleteCreditPaymentUseCase.js";
import { GetAllCreditPaymentUseCase } from "../domain/useCases/getAllCreditPaymentUseCase.js";
import { GetCreditPaymentUseCase } from "../domain/useCases/getCreditPaymentUseCase.js";
import { PatchCreditPaymentUseCase } from "../domain/useCases/patchCreditPaymentUseCase.js";
import { PostCreditPaymentUseCase } from "../domain/useCases/postCreditPaymentUseCase.js";
import { CreditPaymentRepository } from "../repository/creditPaymentRepository.js";

export class CreditPaymentUseCasesController {
  get: GetCreditPaymentUseCase;
  getAll: GetAllCreditPaymentUseCase;
  post: PostCreditPaymentUseCase;
  patch: PatchCreditPaymentUseCase;
  delete: DeleteCreditPaymentUseCase;

  constructor(private readonly repository: CreditPaymentRepository) {
    this.get = new GetCreditPaymentUseCase(this.repository);
    this.getAll = new GetAllCreditPaymentUseCase(this.repository);
    this.post = new PostCreditPaymentUseCase(this.repository);
    this.patch = new PatchCreditPaymentUseCase(this.repository);
    this.delete = new DeleteCreditPaymentUseCase(this.repository);
  }
}
