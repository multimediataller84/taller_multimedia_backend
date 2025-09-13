import type { TGetAllOptions } from "../../../domain/types/TGetAllOptions.js";
import type { IProductRepository } from "../domain/interfaces/IProductRepository.js";
import type { TGetAllEnpoint } from "../domain/types/TGetAllOptions.js";
import type { TProduct } from "../domain/types/TProduct.js";
import type { TProductEndpoint } from "../domain/types/TProductEndpoint.js";
import { ProductService } from "../services/productService.js";

export class ProductRepository implements IProductRepository {
  private static instance: ProductRepository;
  private readonly productService = ProductService.getInstance();

  public static getInstance(): ProductRepository {
    if (!ProductRepository.instance) {
      ProductRepository.instance = new ProductRepository();
    }
    return ProductRepository.instance;
  }

  get = async (id: number): Promise<TProductEndpoint> => {
    try {
      const product = await this.productService.get(id);
      if (!product) {
        throw new Error("source not found");
      }
      return product;
    } catch (error) {
      throw error;
    }
  };

  getAll = async (options: TGetAllOptions): Promise<TGetAllEnpoint> => {
    try {
      const product = await this.productService.getAll(options);
      if (product.data.length === 0) {
        throw new Error("sources not found");
      }
      return product;
    } catch (error) {
      throw error;
    }
  };

  post = async (data: TProduct): Promise<TProductEndpoint> => {
    try {
      const product = await this.productService.post(data);
      if (!product) {
        throw new Error("error at create customer");
      }
      return product;
    } catch (error) {
      throw error;
    }
  };

  patch = async (id: number, data: TProduct): Promise<TProductEndpoint> => {
    try {
      const product = await this.productService.patch(id, data);
      if (!product) {
        throw new Error("error at update source");
      }
      return product;
    } catch (error) {
      throw error;
    }
  };

  delete = async (id: number): Promise<TProductEndpoint> => {
    try {
      const product = await this.productService.delete(id);
      if (!product) {
        throw new Error("error at delete source");
      }
      return product;
    } catch (error) {
      throw error;
    }
  };
}
