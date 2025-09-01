import { ProductRepository } from "../../repository/productRepository.js";
import type { TProduct } from "../types/TProduct.js";

export class PatchProductUseCase {
  constructor(private readonly productRepository: ProductRepository) {}

  async execute(id: number, data: TProduct) {
    return await this.productRepository.patch(id, data);
  }
}
