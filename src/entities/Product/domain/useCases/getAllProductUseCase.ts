import { ProductRepository } from "../../repository/productRepository.js";

export class GetAllProductUseCase {
  constructor(private readonly productRepository: ProductRepository) {}

  async execute() {
    return await this.productRepository.getAll();
  }
}
