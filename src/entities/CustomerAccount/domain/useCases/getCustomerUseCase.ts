import { CustomerRepository } from "../../repository/customerRepository.js";

export class GetCustomerUseCase {
  constructor(private readonly customerRepository: CustomerRepository) {}

  async execute(id: number) {
    return await this.customerRepository.get(id);
  }
}
