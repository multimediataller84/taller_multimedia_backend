import { CreditPaymentRepository } from "../../repository/creditPaymentRepository.js";

export class GetAllCreditPaymentUseCase {
  constructor(private readonly repository: CreditPaymentRepository) {}

  execute = async (credit_id?: number) => {
    return this.repository.getAll(credit_id);
  };
}