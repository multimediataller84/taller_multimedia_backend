import { CreditRepository } from "../../repository/creditRepository.js";
import type { TCredit } from "../types/TCredit.js";

export class PostCreditUseCase {
  constructor(private readonly creditRepository: CreditRepository) {}

  async execute(data: TCredit) {
    return await this.creditRepository.post(data);
  }
}
