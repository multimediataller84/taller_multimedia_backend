import { CashRegisterRepository } from "../../repository/cashRegisterRepository.js";
import type { TCashRegister } from "../types/TCashRegister.js";

export class PatchCashRegisterUseCase {
  constructor(private readonly cashRegisterRepository: CashRegisterRepository) {}

  async execute(id: number, data: TCashRegister) {
    return await this.cashRegisterRepository.patch(id, data);
  }
}
