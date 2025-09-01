import { CustomerRepository } from "../../repository/customerRepository.js";

export class DeleteCustomerUseCase {
  constructor(private readonly customerRepository: CustomerRepository) {}

  async execute(id: number) {
    return await this.customerRepository.delete(id);
  }
}
