import { CashRegisterRepository } from "../../repository/cashRegisterRepository.js";
import type { TCloseRegister } from "../types/TCloseRegister.js";

export class CloseCashRegisterUseCase {
  constructor(private readonly cashRegisterRepository: CashRegisterRepository) {}

  async execute(id: number, data: TCloseRegister) {
    return await this.cashRegisterRepository.close(id, data);
  }
}
