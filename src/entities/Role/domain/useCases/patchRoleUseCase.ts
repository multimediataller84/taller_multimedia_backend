import { RoleRepository } from "../../repository/roleRepository.js";

export class PatchRoleUseCase {
  constructor(private readonly repository: RoleRepository) {}

  async execute(id: number, data: { name?: string; description?: string }) {
    return await this.repository.patch(id, data);
  }
}
