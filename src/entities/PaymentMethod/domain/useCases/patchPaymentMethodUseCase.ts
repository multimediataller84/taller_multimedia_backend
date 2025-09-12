import { PaymentMethodRepository } from "../../repository/paymentMethodRepository.js";
import type { TPaymentMethod } from "../types/TPaymentMethod.js";

export class PatchPaymentMethodUseCase {
  constructor(private readonly repository: PaymentMethodRepository) {}

  async execute(id: number, data: TPaymentMethod) {
    return await this.repository.patch(id, data);
  }
}