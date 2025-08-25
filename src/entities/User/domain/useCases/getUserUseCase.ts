import { UserRepository } from "../../repository/userRepository.js";

export class GetUserUseCase {
  constructor(private readonly userRepository: UserRepository) {}

  async execute(id: number) {
    return await this.userRepository.get(id);
  }
}
