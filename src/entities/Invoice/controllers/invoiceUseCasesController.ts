import { DeleteInvoiceUseCase } from "../domain/useCases/deleteInvoiceUseCase.js";
import { GetAllInvoiceUseCase } from "../domain/useCases/getAllInvoiceUseCase.js";
import { GetInvoiceUseCase } from "../domain/useCases/getInvoiceUseCase.js";
import { PatchInvoiceUseCase } from "../domain/useCases/patchInvoiceUseCase.js";
import { PostInvoiceUseCase } from "../domain/useCases/postInvoiceUseCase.js";
import { InvoiceRepository } from "../repository/invoiceRepository.js";

export class InvoiceUseCasesController {
  get: GetInvoiceUseCase;
  getAll: GetAllInvoiceUseCase;
  post: PostInvoiceUseCase;
  patch: PatchInvoiceUseCase;
  delete: DeleteInvoiceUseCase;

  constructor(private readonly repository: InvoiceRepository) {
    this.get = new GetInvoiceUseCase(this.repository);
    this.getAll = new GetAllInvoiceUseCase(this.repository);
    this.post = new PostInvoiceUseCase(this.repository);
    this.patch = new PatchInvoiceUseCase(this.repository);
    this.delete = new DeleteInvoiceUseCase(this.repository);
  }
}
