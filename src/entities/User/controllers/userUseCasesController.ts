import { DeleteUserUseCase } from "../domain/useCases/deleteUserUseCase.js";
import { GetAllUserUseCase } from "../domain/useCases/getAllUserUseCase.js";
import { GetUserUseCase } from "../domain/useCases/getUserUseCase.js";
import { LoginUserUseCase } from "../domain/useCases/loginUserUseCase.js";
import { PatchUserUseCase } from "../domain/useCases/patchUserUseCase.js";
import { PostUserUseCase } from "../domain/useCases/postUserUseCase.js";
import { UserRepository } from "../repository/userRepository.js";

export class UserUseCasesController {
  get: GetUserUseCase;
  getAll: GetAllUserUseCase;
  post: PostUserUseCase;
  patch: PatchUserUseCase;
  delete: DeleteUserUseCase;
  login: LoginUserUseCase;

  constructor(private readonly repository: UserRepository) {
    this.get = new GetUserUseCase(this.repository);
    this.getAll = new GetAllUserUseCase(this.repository);
    this.post = new PostUserUseCase(this.repository);
    this.patch = new PatchUserUseCase(this.repository);
    this.delete = new DeleteUserUseCase(this.repository);
    this.login = new LoginUserUseCase(this.repository);
  }
}
