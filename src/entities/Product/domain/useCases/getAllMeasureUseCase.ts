import { ProductRepository } from "../../repository/productRepository.js";

export class GetAllMeasureUseCase {
  constructor(private readonly productRepository: ProductRepository) {}

  async execute() {
    return await this.productRepository.getAllMeasure();
  }
}
