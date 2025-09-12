import { PaymentMethodRepository } from "../../repository/paymentMethodRepository.js";

export class DeletePaymentMethodUseCase {
  constructor(private readonly repository: PaymentMethodRepository) {}

  async execute(id: number) {
    return await this.repository.delete(id);
  }
}