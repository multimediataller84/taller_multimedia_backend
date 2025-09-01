import { ProductRepository } from "../../repository/productRepository.js";

export class DeleteProductUseCase {
  constructor(private readonly productRepository: ProductRepository) {}

  async execute(id: number) {
    return await this.productRepository.delete(id);
  }
}
