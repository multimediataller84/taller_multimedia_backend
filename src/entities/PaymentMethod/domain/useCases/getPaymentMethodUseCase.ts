import { PaymentMethodRepository } from "../../repository/paymentMethodRepository.js";

export class GetPaymentMethodUseCase {
  constructor(private readonly repository: PaymentMethodRepository) {}

  async execute(id: number) {
    return await this.repository.get(id);
  }
}