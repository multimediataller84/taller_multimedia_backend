import { CategoryRepository } from "../../repository/categoryRepository.js";

export class DeleteCategoryUseCase {
  constructor(private readonly categoryRepository: CategoryRepository) {}

  async execute(id: number) {
    return await this.categoryRepository.delete(id);
  }
}
