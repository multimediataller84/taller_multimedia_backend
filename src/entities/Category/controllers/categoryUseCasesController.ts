import { DeleteCategoryUseCase } from "../domain/useCases/deleteCategoryUseCase.js";
import { GetAllCategoryUseCase } from "../domain/useCases/getCategoryRoleUseCase.js";
import { GetCategoryUseCase } from "../domain/useCases/getCategoryUseCase.js";
import { PatchCategoryUseCase } from "../domain/useCases/patchCategoryUseCase.js";
import { PostCategoryUseCase } from "../domain/useCases/postCategoryUseCase.js";
import { CategoryRepository } from "../repository/categoryRepository.js";

export class CategoryUseCasesController {
  get: GetCategoryUseCase;
  getAll: GetAllCategoryUseCase;
  post: PostCategoryUseCase;
  patch: PatchCategoryUseCase;
  delete: DeleteCategoryUseCase;

  constructor(private readonly repository: CategoryRepository) {
    this.get = new GetCategoryUseCase(this.repository);
    this.getAll = new GetAllCategoryUseCase(this.repository);
    this.post = new PostCategoryUseCase(this.repository);
    this.patch = new PatchCategoryUseCase(this.repository);
    this.delete = new DeleteCategoryUseCase(this.repository);
  }
}
