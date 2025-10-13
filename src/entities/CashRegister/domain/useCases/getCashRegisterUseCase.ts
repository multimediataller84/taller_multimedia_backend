import { CashRegisterRepository } from "../../repository/cashRegisterRepository.js";

export class GetCashRegisterUseCase {
  constructor(private readonly cashRegisterRepository: CashRegisterRepository) {}

  async execute(id: number) {
    return await this.cashRegisterRepository.get(id);
  }
}
