import { ProductRepository } from "../../repository/productRepository.js";

export class GetProductUseCase {
  constructor(private readonly productRepository: ProductRepository) {}

  async execute(id: number) {
    return await this.productRepository.get(id);
  }
}
