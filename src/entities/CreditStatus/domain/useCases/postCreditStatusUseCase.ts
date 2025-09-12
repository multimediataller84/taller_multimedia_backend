import { CreditStatusRepository } from "../../repository/creditStatusRepository.js";
import type { TCreditStatus } from "../types/TCreditStatus.js";

export class PostCreditStatusUseCase {
  constructor(private readonly repository: CreditStatusRepository) {}

  async execute(data: TCreditStatus) {
    return await this.repository.post(data);
  }
}
