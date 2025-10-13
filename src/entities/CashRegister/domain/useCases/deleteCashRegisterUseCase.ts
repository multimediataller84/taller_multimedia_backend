import { CashRegisterRepository } from "../../repository/cashRegisterRepository.js";

export class DeleteCashRegisterUseCase {
  constructor(private readonly cashRegisterRepository: CashRegisterRepository) {}

  async execute(id: number) {
    return await this.cashRegisterRepository.delete(id);
  }
}
