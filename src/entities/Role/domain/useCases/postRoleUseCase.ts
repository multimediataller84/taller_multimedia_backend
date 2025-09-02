import { RoleRepository } from "../../repository/roleRepository.js";
import type { TRole } from "../types/TRole.js";

export class PostRoleUseCase {
  constructor(private readonly repository: RoleRepository) {}

  async execute(data: TRole) {
    return await this.repository.post(data);
  }
}
