import { CreditStatusRepository } from "../../repository/creditStatusRepository.js";

export class GetCreditStatusUseCase {
  constructor(private readonly repository: CreditStatusRepository) {}

  async execute(id: number) {
    return await this.repository.get(id);
  }
}
