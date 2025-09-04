import { CreditPaymentRepository } from "../../repository/creditPaymentRepository.js";
import type { TCreditPayment } from "../types/TCreditPayment.js";

export class PatchCreditPaymentUseCase {
  constructor(private readonly creditPaymentRepository: CreditPaymentRepository) {}

  async execute(id: number, data: TCreditPayment) {
    return await this.creditPaymentRepository.patch(id, data);
  }
}
