import { PaymentMethodRepository } from "../../repository/paymentMethodRepository.js";
import type { TPaymentMethod } from "../types/TPaymentMethod.js";

export class PostPaymentMethodUseCase {
  constructor(private readonly repository: PaymentMethodRepository) {}

  async execute(data: TPaymentMethod) {
    return await this.repository.post(data);
  }
}