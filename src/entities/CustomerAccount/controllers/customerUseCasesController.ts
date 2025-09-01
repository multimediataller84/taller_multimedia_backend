import { DeleteCustomerUseCase } from "../domain/useCases/deleteCustomerUseCase.js";
import { GetAllCustomerUseCase } from "../domain/useCases/getAllCustomerUseCase.js";
import { GetCustomerUseCase } from "../domain/useCases/getCustomerUseCase.js";

import { PatchCustomerUseCase } from "../domain/useCases/patchCustomerUseCase.js";
import { PostCustomerUseCase } from "../domain/useCases/postCustomerUseCase.js";
import { CustomerRepository } from "../repository/customerRepository.js";

export class CustomerUseCasesController {
  get: GetCustomerUseCase;
  getAll: GetAllCustomerUseCase;
  post: PostCustomerUseCase;
  patch: PatchCustomerUseCase;
  delete: DeleteCustomerUseCase;

  constructor(private readonly repository: CustomerRepository) {
    this.get = new GetCustomerUseCase(this.repository);
    this.getAll = new GetAllCustomerUseCase(this.repository);
    this.post = new PostCustomerUseCase(this.repository);
    this.patch = new PatchCustomerUseCase(this.repository);
    this.delete = new DeleteCustomerUseCase(this.repository);
  }
}
