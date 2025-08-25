import { UserRepository } from "../../repository/userRepository.js";

export class GetAllUserUseCase {
  constructor(private readonly userRepository: UserRepository) {}

  async execute() {
    return await this.userRepository.getAll();
  }
}
