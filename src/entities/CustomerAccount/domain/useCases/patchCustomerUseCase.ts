import { CustomerRepository } from "../../repository/customerRepository.js";
import type { TCustomer } from "../types/TCustomer.js";

export class PatchCustomerUseCase {
  constructor(private readonly customerRepository: CustomerRepository) {}

  async execute(id: number, data: TCustomer) {
    return await this.customerRepository.patch(id, data);
  }
}
