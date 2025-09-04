import { CreditPaymentRepository } from "../../repository/creditPaymentRepository.js";
import type { TCreditPayment } from "../types/TCreditPayment.js";

export class PostCreditPaymentUseCase {
  constructor(private readonly creditPaymentRepository: CreditPaymentRepository) {}

  async execute(data: TCreditPayment) {
    return await this.creditPaymentRepository.post(data);
  }
}
