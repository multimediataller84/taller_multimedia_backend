import { RoleRepository } from "../../repository/roleRepository.js";

export class PostRoleUseCase {
  constructor(private readonly repository: RoleRepository) {}

  async execute(data: { name: string; description?: string }) {
    return await this.repository.post(data);
  }
}
