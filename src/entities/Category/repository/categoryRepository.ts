import type { ICategoryRepository } from "../domain/interfaces/ICategoryRepository.js";
import type { TCategory } from "../domain/types/TCategory.js";
import type { TCategoryEndpoint } from "../domain/types/TCategoryEndpoint.js";
import { CategoryService } from "../services/categoryService.js";

export class CategoryRepository implements ICategoryRepository{
  private static instance: CategoryRepository;
  private readonly categoryService = CategoryService.getInstance();

  public static getInstance(): CategoryRepository {
    if (!CategoryRepository.instance) {
      CategoryRepository.instance = new CategoryRepository();
    }
    return CategoryRepository.instance;
  }

  get = async (id: number): Promise<TCategoryEndpoint> => {
    try {
      const role = await this.categoryService.get(id);
      if (!role) {
        throw new Error("source not found");
      }
      return role;
    } catch (error) {
      throw error;
    }
  };

  getAll = async (): Promise<TCategoryEndpoint[]> => {
    try {
      const roles = await this.categoryService.getAll();
      if (!roles) {
        throw new Error("sources not found");
      }
      return roles;
    } catch (error) {
      throw error;
    }
  };


  post = async (data: TCategory): Promise<TCategoryEndpoint> => {
    try {
      const role = await this.categoryService.post(data);
      if (!role) {
        throw new Error("error creating source");
      }
      return role;
    } catch (error) {
      throw error;
    }
  };

  patch = async (id: number, data: TCategory): Promise<TCategoryEndpoint> => {
    try {
      const role = await this.categoryService.patch(id, data);
      if (!role) {
        throw new Error("error updating source");
      }
      return role;
    } catch (error) {
      throw error;
    }
  };

  delete = async (id: number): Promise<TCategoryEndpoint> => {
    try {
      const role = await this.categoryService.delete(id);
      if (!role) {
        throw new Error("error deleting source");
      }
      return role;
    } catch (error) {
      throw error;
    }
  };
}
