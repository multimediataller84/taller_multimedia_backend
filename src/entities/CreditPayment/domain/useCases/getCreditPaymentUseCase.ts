import { CreditPaymentRepository } from "../../repository/creditPaymentRepository.js";

export class GetCreditPaymentUseCase {
  constructor(private readonly creditPaymentRepository: CreditPaymentRepository) {}

  async execute(id: number) {
    return await this.creditPaymentRepository.get(id);
  }
}
