import { CustomerRepository } from "../../repository/customerRepository.js";

export class GetAllCantonUseCase {
  constructor(private readonly customerRepository: CustomerRepository) {}

  async execute() {
    return await this.customerRepository.getAllCanton();
  }
}
