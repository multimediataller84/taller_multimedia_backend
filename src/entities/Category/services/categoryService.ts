import Product from "../../Product/domain/models/ProductModel.js";
import Tax from "../../Tax/domain/models/TaxModel.js";
import type { ICategoryServices } from "../domain/interfaces/ICategoryServices.js";
import Category from "../domain/models/CategoryModel.js";
import type { TCategory } from "../domain/types/TCategory.js";
import type { TCategoryEndpoint } from "../domain/types/TCategoryEndpoint.js";

export class CategoryService implements ICategoryServices {
  private static instance: CategoryService;

  public static getInstance(): CategoryService {
    if (!CategoryService.instance) {
      CategoryService.instance = new CategoryService();
    }
    return CategoryService.instance;
  }

  get = async (id: number): Promise<TCategoryEndpoint> => {
    try {
      const category = await Category.findByPk(id, {
        include: [
          {
            model: Product,
            as: "products",
            attributes: ["product_name", "sku", "stock"],
          },
        ],
      });
      if (!category) {
        throw new Error("category not found");
      }
      return category;
    } catch (error) {
      throw error;
    }
  };

  getAll = async (): Promise<TCategoryEndpoint[]> => {
    try {
      const category = await Category.findAll({
        include: [
          {
            model: Product,
            as: "products",
            attributes: ["product_name", "sku", "stock"],
          },
        ],
      });
      if (category.length === 0) {
        throw new Error("category not found");
      }
      return category;
    } catch (error) {
      throw error;
    }
  };

  post = async (data: TCategory): Promise<TCategoryEndpoint> => {
    try {
      const { name } = data;

      const exists = await Category.findOne({ where: { name } });
      if (exists) throw new Error("name already exists");

      const category = await Category.create(data, {
        include: [
          {
            model: Product,
            as: "products",
            attributes: ["product_name", "sku", "stock"],
          },
        ],
      });
      return category;
    } catch (error) {
      throw error;
    }
  };

  patch = async (id: number, data: TCategory): Promise<TCategoryEndpoint> => {
    try {
      const category = await Category.findByPk(id);
      if (!category) throw new Error("category not found");

      await category.update(data);

      const updated = await Category.findByPk(id, {
        include: [
          {
            model: Product,
            as: "products",
            attributes: ["product_name", "sku", "stock"],
          },
        ],
      });

      return updated ?? category;
    } catch (error) {
      throw error;
    }
  };

  delete = async (id: number): Promise<TCategoryEndpoint> => {
    try {
      const category = await Category.findByPk(id, {
        include: [
          {
            model: Product,
            as: "products",
            attributes: ["product_name", "sku", "stock"],
          },
        ],
      });
      if (!category) throw new Error("category not found");

      await category.destroy();
      return category;
    } catch (error) {
      throw error;
    }
  };
}
