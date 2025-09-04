import { CreditPaymentRepository } from "../../repository/creditPaymentRepository.js";

export class DeleteCreditPaymentUseCase {
  constructor(private readonly creditPaymentRepository: CreditPaymentRepository) {}

  async execute(id: number) {
    return await this.creditPaymentRepository.delete(id);
  }
}
