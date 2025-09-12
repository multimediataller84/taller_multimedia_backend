import { PaymentMethodRepository } from "../../repository/paymentMethodRepository.js";

export class GetAllPaymentMethodUseCase {
  constructor(private readonly repository: PaymentMethodRepository) {}

  async execute() {
    return await this.repository.getAll();
  }
}