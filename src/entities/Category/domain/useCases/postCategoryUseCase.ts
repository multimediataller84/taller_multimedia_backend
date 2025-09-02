import { CategoryRepository } from "../../repository/categoryRepository.js";
import type { TCategory } from "../types/TCategory.js";

export class PostCategoryUseCase {
  constructor(private readonly categoryRepository: CategoryRepository) {}

  async execute(data: TCategory) {
    return await this.categoryRepository.post(data);
  }
}
