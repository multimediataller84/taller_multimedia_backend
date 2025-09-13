import type { TGetAllOptions } from "../../../../domain/types/TGetAllOptions.js";
import { ProductRepository } from "../../repository/productRepository.js";

export class GetAllProductUseCase {
  constructor(private readonly productRepository: ProductRepository) {}

  async execute(options: TGetAllOptions) {
    return await this.productRepository.getAll(options);
  }
}
