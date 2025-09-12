import { PaymentMethodRepository } from "../repository/paymentMethodRepository.js";
import { GetPaymentMethodUseCase } from "../domain/useCases/getPaymentMethodUseCase.js";
import { GetAllPaymentMethodUseCase } from "../domain/useCases/getAllPaymentMethodUseCase.js";
import { PostPaymentMethodUseCase } from "../domain/useCases/postPaymentMethodUseCase.js";
import { PatchPaymentMethodUseCase } from "../domain/useCases/patchPaymentMethodUseCase.js";
import { DeletePaymentMethodUseCase } from "../domain/useCases/deletePaymentMethodUseCase.js";

export class PaymentMethodUseCasesController {
  get: GetPaymentMethodUseCase;
  getAll: GetAllPaymentMethodUseCase;
  post: PostPaymentMethodUseCase;
  patch: PatchPaymentMethodUseCase;
  delete: DeletePaymentMethodUseCase;

  constructor(private readonly repository: PaymentMethodRepository) {
    this.get = new GetPaymentMethodUseCase(this.repository);
    this.getAll = new GetAllPaymentMethodUseCase(this.repository);
    this.post = new PostPaymentMethodUseCase(this.repository);
    this.patch = new PatchPaymentMethodUseCase(this.repository);
    this.delete = new DeletePaymentMethodUseCase(this.repository);
  }
}
