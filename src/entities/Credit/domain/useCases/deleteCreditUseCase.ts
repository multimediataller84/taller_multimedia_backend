import { CreditRepository } from "../../repository/creditRepository.js";

export class DeleteCreditUseCase {
  constructor(private readonly creditRepository: CreditRepository) {}

  async execute(id: number) {
    return await this.creditRepository.delete(id);
  }
}
