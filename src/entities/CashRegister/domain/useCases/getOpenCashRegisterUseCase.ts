import { CashRegisterRepository } from "../../repository/cashRegisterRepository.js";

export class GetOpenCashRegisterUseCase {
  constructor(private readonly cashRegisterRepository: CashRegisterRepository) {}

  async execute() {
    return await this.cashRegisterRepository.getOpen();
  }
}
