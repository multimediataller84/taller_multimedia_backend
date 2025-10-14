import { CustomerRepository } from "../../repository/customerRepository.js";

export class GetAllDistrictUseCase {
  constructor(private readonly customerRepository: CustomerRepository) {}

  async execute() {
    return await this.customerRepository.getAllDistrict();
  }
}
