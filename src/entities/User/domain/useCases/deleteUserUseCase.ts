import { UserRepository } from "../../repository/userRepository.js";

export class DeleteUserUseCase {
  constructor(private readonly userRepository: UserRepository) {}

  async execute(id: number) {
    return await this.userRepository.delete(id);
  }
}
