import { CustomerRepository } from "../../repository/customerRepository.js";

export class GetAllProvinceUseCase {
  constructor(private readonly customerRepository: CustomerRepository) {}

  async execute() {
    return await this.customerRepository.getAllProvince();
  }
}
