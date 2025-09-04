import Product from "../domain/models/ProductModel.js";
import type { IProductServices } from "../domain/interfaces/IProductServices.js";
import type { TProductEndpoint } from "../domain/types/TProductEndpoint.js";
import type { TProduct } from "../domain/types/TProduct.js";
import Tax from "../../Tax/domain/models/TaxModel.js";
import Category from "../../Category/domain/models/CategoryModel.js";

export class ProductService implements IProductServices {
  private static instance: ProductService;

  public static getInstance(): ProductService {
    if (!ProductService.instance) {
      ProductService.instance = new ProductService();
    }
    return ProductService.instance;
  }

  get = async (id: number): Promise<TProductEndpoint> => {
    try {
      const product = await Product.findByPk(id, {
        include: [
          {
            model: Tax,
            as: "tax",
            attributes: ["name", "percentage", "description"],
          },
          {
            model: Category,
            as: "category",
            attributes: ["name", "description"]
          }
        ],
      });
      if (!product) {
        throw new Error("product not found");
      }
      return product;
    } catch (error) {
      throw error;
    }
  };

  getAll = async (): Promise<TProductEndpoint[]> => {
    try {
      const invoice = await Product.findAll({
        include: [
          {
            model: Tax,
            as: "tax",
            attributes: ["name", "percentage", "description"],
          },
          {
            model: Category,
            as: "category",
            attributes: ["name", "description"]
          }
        ],
      });

      if (invoice.length === 0) {
        throw new Error("product not found");
      }
      return invoice;
    } catch (error) {
      throw error;
    }
  };

  post = async (data: TProduct): Promise<TProductEndpoint> => {
    try {
      const { sku } = data;
      const exists = await Product.findOne({ where: { sku } });
      if (exists) throw new Error("product already exists");

      const product = await Product.create(data, {
        include: [
          {
            model: Tax,
            as: "tax",
            attributes: ["name", "percentage", "description"],
          },
          {
            model: Category,
            as: "category",
            attributes: ["name", "description"]
          }
        ],
      });

      return product;
    } catch (error) {
      throw error;
    }
  };

  patch = async (id: number, data: TProduct): Promise<TProductEndpoint> => {
    try {
      const product = await Product.findByPk(id);
      if (!product) {
        throw new Error("product not found");
      }
      await product.update(data);

      const update = await Product.findByPk(id, {
        include: [
          {
            model: Tax,
            as: "tax",
            attributes: ["name", "percentage", "description"],
          },
          {
            model: Category,
            as: "category",
            attributes: ["name", "description"]
          }
        ],
      });

      return update ?? product;
    } catch (error) {
      throw error;
    }
  };

  delete = async (id: number): Promise<TProductEndpoint> => {
    try {
      const product = await Product.findByPk(id, {
        include: [
          {
            model: Tax,
            as: "tax",
            attributes: ["name", "percentage", "description"],
          },
          {
            model: Category,
            as: "category",
            attributes: ["name", "description"]
          }
        ],
      });

      if (!product) {
        throw new Error("product not found");
      }
      await product.destroy();
      return product;
    } catch (error) {
      throw error;
    }
  };
}
