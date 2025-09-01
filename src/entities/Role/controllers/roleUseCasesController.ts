import { RoleRepository } from "../repository/roleRepository.js";
import { GetRoleUseCase } from "../domain/useCases/getRoleUseCase.js";
import { GetAllRoleUseCase } from "../domain/useCases/getAllRoleUseCase.js";
import { PostRoleUseCase } from "../domain/useCases/postRoleUseCase.js";
import { PatchRoleUseCase } from "../domain/useCases/patchRoleUseCase.js";
import { DeleteRoleUseCase } from "../domain/useCases/deleteRoleUseCase.js";

export class RoleUseCasesController {
  get: GetRoleUseCase;
  getAll: GetAllRoleUseCase;
  post: PostRoleUseCase;
  patch: PatchRoleUseCase;
  delete: DeleteRoleUseCase;

  constructor(private readonly repository: RoleRepository) {
    this.get = new GetRoleUseCase(this.repository);
    this.getAll = new GetAllRoleUseCase(this.repository);
    this.post = new PostRoleUseCase(this.repository);
    this.patch = new PatchRoleUseCase(this.repository);
    this.delete = new DeleteRoleUseCase(this.repository);
  }
}
