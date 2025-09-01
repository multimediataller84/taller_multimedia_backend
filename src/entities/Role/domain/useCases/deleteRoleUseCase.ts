import { RoleRepository } from "../../repository/roleRepository.js";

export class DeleteRoleUseCase {
  constructor(private readonly repository: RoleRepository) {}

  async execute(id: number) {
    return await this.repository.delete(id);
  }
}
