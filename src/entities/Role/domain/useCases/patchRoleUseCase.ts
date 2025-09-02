import { RoleRepository } from "../../repository/roleRepository.js";
import type { TRole } from "../types/TRole.js";

export class PatchRoleUseCase {
  constructor(private readonly repository: RoleRepository) {}

  async execute(id: number, data: TRole) {
    return await this.repository.patch(id, data);
  }
}
