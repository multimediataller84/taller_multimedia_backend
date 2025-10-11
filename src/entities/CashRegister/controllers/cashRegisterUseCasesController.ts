import { CloseCashRegisterUseCase } from "../domain/useCases/closeCashRegisterUseCase.js";
import { DeleteCashRegisterUseCase } from "../domain/useCases/deleteCashRegisterUseCase.js";
import { GetAllCashRegisterUseCase } from "../domain/useCases/getAllCashRegisterUseCase.js";
import { GetCashRegisterUseCase } from "../domain/useCases/getCashRegisterUseCase.js";
import { GetOpenCashRegisterUseCase } from "../domain/useCases/getOpenCashRegisterUseCase.js";
import { OpenCashRegisterUseCase } from "../domain/useCases/openCashRegisterUseCase.js";
import { PatchCashRegisterUseCase } from "../domain/useCases/patchCashRegisterUseCase.js";
import { PostCashRegisterUseCase } from "../domain/useCases/postCashRegisterUseCase.js";
import { CashRegisterRepository } from "../repository/cashRegisterRepository.js";

export class CashRegisterUseCasesController {
  get: GetCashRegisterUseCase;
  getAll: GetAllCashRegisterUseCase;
  post: PostCashRegisterUseCase;
  patch: PatchCashRegisterUseCase;
  delete: DeleteCashRegisterUseCase;
  open: OpenCashRegisterUseCase;
  close: CloseCashRegisterUseCase;
  getOpen: GetOpenCashRegisterUseCase;

  constructor(private readonly repository: CashRegisterRepository) {
    this.get = new GetCashRegisterUseCase(this.repository);
    this.getAll = new GetAllCashRegisterUseCase(this.repository);
    this.post = new PostCashRegisterUseCase(this.repository);
    this.patch = new PatchCashRegisterUseCase(this.repository);
    this.delete = new DeleteCashRegisterUseCase(this.repository);
    this.open = new OpenCashRegisterUseCase(this.repository);
    this.close = new CloseCashRegisterUseCase(this.repository); 
    this.getOpen = new GetOpenCashRegisterUseCase(this.repository);
  }
}
