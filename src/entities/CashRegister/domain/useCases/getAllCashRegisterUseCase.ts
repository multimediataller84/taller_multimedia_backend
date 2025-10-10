import { CashRegisterRepository } from "../../repository/cashRegisterRepository.js";

export class GetAllCashRegisterUseCase {
  constructor(private readonly cashRegisterRepository: CashRegisterRepository) {}

  async execute() {
    return await this.cashRegisterRepository.getAll();
  }
}
