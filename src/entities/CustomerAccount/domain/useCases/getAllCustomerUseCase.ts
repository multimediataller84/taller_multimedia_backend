import { CustomerRepository } from "../../repository/customerRepository.js";

export class GetAllCustomerUseCase {
  constructor(private readonly customerRepository: CustomerRepository) {}

  async execute() {
    return await this.customerRepository.getAll();
  }
}
