import { CreditPaymentRepository } from "../../repository/creditPaymentRepository.js";

export class GetAllByUserCreditPaymentUseCase {
  constructor(private readonly repository: CreditPaymentRepository) {}

  execute = async (id: number) => {
    return this.repository.getAllByUser(id);
  };
}