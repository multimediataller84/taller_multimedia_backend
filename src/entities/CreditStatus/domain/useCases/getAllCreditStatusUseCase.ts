import { CreditStatusRepository } from "../../repository/creditStatusRepository.js";

export class GetAllCreditStatusUseCase {
  constructor(private readonly repository: CreditStatusRepository) {}

  async execute() {
    return await this.repository.getAll();
  }
}
