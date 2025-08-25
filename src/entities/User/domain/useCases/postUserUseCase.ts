import { UserRepository } from "../../repository/userRepository.js";
import type { TUser } from "../types/TUser.js";

export class PostUserUseCase {
  constructor(private readonly userRepository: UserRepository) {}

  async execute(data: TUser) {
    return await this.userRepository.post(data);
  }
}
