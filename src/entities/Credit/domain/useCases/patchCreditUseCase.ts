import { CreditRepository } from "../../repository/creditRepository.js";
import type { TCredit } from "../types/TCredit.js";

export class PatchCreditUseCase {
  constructor(private readonly creditRepository: CreditRepository) {}

  async execute(id: number, data: TCredit) {
    return await this.creditRepository.patch(id, data);
  }
}
