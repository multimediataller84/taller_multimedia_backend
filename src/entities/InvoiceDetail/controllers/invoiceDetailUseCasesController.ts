import { DeleteInvoiceDetailUseCase } from "../domain/useCases/deleteInvoiceDetailUseCase.js";
import { GetAllInvoiceDetailUseCase } from "../domain/useCases/getAllInvoiceDetailUseCase.js";
import { GetInvoiceDetailUseCase } from "../domain/useCases/getInvoiceDetailUseCase.js";
import { PatchInvoiceDetailUseCase } from "../domain/useCases/patchInvoiceDetailUseCase.js";
import { PostInvoiceDetailUseCase } from "../domain/useCases/postInvoiceDetailUseCase.js";
import { InvoiceDetailRepository } from "../repository/invoiceDetailRepository.js";

export class InvoiceDetailUseCasesController {
  get: GetInvoiceDetailUseCase;
  getAll: GetAllInvoiceDetailUseCase;
  post: PostInvoiceDetailUseCase;
  patch: PatchInvoiceDetailUseCase;
  delete: DeleteInvoiceDetailUseCase;

  constructor(private readonly repository: InvoiceDetailRepository) {
    this.get = new GetInvoiceDetailUseCase(this.repository);
    this.getAll = new GetAllInvoiceDetailUseCase(this.repository);
    this.post = new PostInvoiceDetailUseCase(this.repository);
    this.patch = new PatchInvoiceDetailUseCase(this.repository);
    this.delete = new DeleteInvoiceDetailUseCase(this.repository);
  }
}
