import { RoleRepository } from "../../repository/roleRepository.js";

export class GetRoleUseCase {
  constructor(private readonly repository: RoleRepository) {}

  async execute(id: number) {
    return await this.repository.get(id);
  }
}