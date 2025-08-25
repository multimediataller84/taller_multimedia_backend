import { UserRepository } from "../../repository/userRepository.js";
import type { TLogin } from "../types/TLogin.js";

export class LoginUserUseCase {
  constructor(private readonly userRepository: UserRepository) {}

  async execute(data: TLogin) {
    return await this.userRepository.login(data);
  }
}
