import { CategoryRepository } from "../../repository/categoryRepository.js";
import type { TCategory } from "../types/TCategory.js";

export class PatchCategoryUseCase {
  constructor(private readonly categoryRepository: CategoryRepository) {}

  async execute(id: number, data: TCategory) {
    return await this.categoryRepository.patch(id, data);
  }
}
