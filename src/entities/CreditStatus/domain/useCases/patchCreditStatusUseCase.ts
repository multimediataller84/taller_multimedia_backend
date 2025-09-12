import { CreditStatusRepository } from "../../repository/creditStatusRepository.js";
import type { TCreditStatus } from "../types/TCreditStatus.js";

export class PatchCreditStatusUseCase {
  constructor(private readonly repository: CreditStatusRepository) {}

  async execute(id: number, data: TCreditStatus) {
    return await this.repository.patch(id, data);
  }
}
