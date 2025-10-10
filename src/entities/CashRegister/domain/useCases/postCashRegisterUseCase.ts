import { CashRegisterRepository } from "../../repository/cashRegisterRepository.js";
import type { TCashRegister } from "../types/TCashRegister.js";

export class PostCashRegisterUseCase {
  constructor(private readonly cashRegisterRepository: CashRegisterRepository) {}

  async execute(data: TCashRegister) {
    return await this.cashRegisterRepository.post(data);
  }
}
