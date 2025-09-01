import { RoleRepository } from "../../repository/roleRepository.js";

export class GetAllRoleUseCase {
  constructor(private readonly repository: RoleRepository) {}

  async execute() {
    return await this.repository.getAll();
  }
}
