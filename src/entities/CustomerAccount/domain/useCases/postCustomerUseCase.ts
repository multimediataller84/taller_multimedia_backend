import { CustomerRepository } from "../../repository/customerRepository.js";
import type { TCustomer } from "../types/TCustomer.js";

export class PostCustomerUseCase {
  constructor(private readonly customerRepository: CustomerRepository) {}

  async execute(data: TCustomer) {
    return await this.customerRepository.post(data);
  }
}
