import { CreditRepository } from "../../repository/creditRepository.js";

export class GetAllCreditUseCase {
  constructor(private readonly creditRepository: CreditRepository) {}

  async execute() {
    return await this.creditRepository.getAll();
  }
}
