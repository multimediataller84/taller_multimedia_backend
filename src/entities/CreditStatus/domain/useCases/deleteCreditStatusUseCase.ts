import { CreditStatusRepository } from "../../repository/creditStatusRepository.js";

export class DeleteCreditStatusUseCase {
  constructor(private readonly repository: CreditStatusRepository) {}

  async execute(id: number) {
    return await this.repository.delete(id);
  }
}
