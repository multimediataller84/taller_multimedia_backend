import Product from "../domain/models/ProductModel.js";
import type { IProductServices } from "../domain/interfaces/IProductServices.js";
import type { TProductEndpoint } from "../domain/types/TProductEndpoint.js";
import type { TProduct } from "../domain/types/TProduct.js";

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
      const product = await Product.findByPk(id);
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
      const invoice = await Product.findAll();
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

      const product = await Product.create(data);
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
      return product;
    } catch (error) {
      throw error;
    }
  };

  delete = async (id: number): Promise<TProductEndpoint> => {
    try {
      const product = await Product.findByPk(id);
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
