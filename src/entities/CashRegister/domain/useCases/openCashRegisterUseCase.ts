import { CashRegisterRepository } from "../../repository/cashRegisterRepository.js";
import type { TOpenRegister } from "../types/TOpenRegister.js";

export class OpenCashRegisterUseCase {
  constructor(private readonly cashRegisterRepository: CashRegisterRepository) {}

  async execute(id: number, data: TOpenRegister) {
    return await this.cashRegisterRepository.open(id, data);
  }
}
