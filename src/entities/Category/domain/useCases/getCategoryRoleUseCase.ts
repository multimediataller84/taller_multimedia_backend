import { CategoryRepository } from "../../repository/categoryRepository.js";

export class GetAllCategoryUseCase {
  constructor(private readonly categoryRepository: CategoryRepository) {}

  async execute() {
    return await this.categoryRepository.getAll();
  }
}
