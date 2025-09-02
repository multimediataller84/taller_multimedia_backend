import { CategoryRepository } from "../../repository/categoryRepository.js";

export class GetCategoryUseCase {
  constructor(private readonly categoryRepository: CategoryRepository) {}

  async execute(id: number) {
    return await this.categoryRepository.get(id);
  }
}