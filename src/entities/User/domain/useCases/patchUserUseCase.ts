import { UserRepository } from "../../repository/userRepository.js";
import type { TUser } from "../types/TUser.js";

export class PatchUserUseCase {
  constructor(private readonly userRepository: UserRepository) {}

  async execute(id: number, data: TUser) {
    return await this.userRepository.patch(id, data);
  }
}
