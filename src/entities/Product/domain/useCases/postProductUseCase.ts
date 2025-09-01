import { ProductRepository } from "../../repository/productRepository.js";
import type { TProduct } from "../types/TProduct.js";

export class PostProductUseCase {
  constructor(private readonly productRepository: ProductRepository) {}

  async execute(data: TProduct) {
    return await this.productRepository.post(data);
  }
}
