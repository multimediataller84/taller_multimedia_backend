import { CreditRepository } from "../../repository/creditRepository.js";

export class GetCreditUseCase {
  constructor(private readonly creditRepository: CreditRepository) {}

  async execute(id: number) {
    return await this.creditRepository.get(id);
  }
}
