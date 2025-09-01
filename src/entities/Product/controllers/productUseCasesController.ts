import { DeleteProductUseCase } from "../domain/useCases/deleteProductUseCase.js";
import { GetAllProductUseCase } from "../domain/useCases/getAllProductUseCase.js";
import { GetProductUseCase } from "../domain/useCases/getProductUseCase.js";
import { PatchProductUseCase } from "../domain/useCases/patchProductUseCase.js";
import { PostProductUseCase } from "../domain/useCases/postProductUseCase.js";
import { ProductRepository } from "../repository/productRepository.js";

export class ProductUseCasesController {
  get: GetProductUseCase;
  getAll: GetAllProductUseCase;
  post: PostProductUseCase;
  patch: PatchProductUseCase;
  delete: DeleteProductUseCase;

  constructor(private readonly repository: ProductRepository) {
    this.get = new GetProductUseCase(this.repository);
    this.getAll = new GetAllProductUseCase(this.repository);
    this.post = new PostProductUseCase(this.repository);
    this.patch = new PatchProductUseCase(this.repository);
    this.delete = new DeleteProductUseCase(this.repository);
  }
}
