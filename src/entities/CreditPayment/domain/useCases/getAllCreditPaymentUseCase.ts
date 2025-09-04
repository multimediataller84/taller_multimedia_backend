import { CreditPaymentRepository } from "../../repository/creditPaymentRepository.js";

export class GetAllCreditPaymentUseCase {
  constructor(private readonly creditPaymentRepository: CreditPaymentRepository) {}

  async execute() {
    return await this.creditPaymentRepository.getAll();
  }
}
