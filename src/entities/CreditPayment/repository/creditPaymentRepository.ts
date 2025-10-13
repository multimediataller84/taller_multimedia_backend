import type { ICreditPaymentRepository } from "../domain/interfaces/ICreditPaymentRepository.js";
import type { TCreditPayment } from "../domain/types/TCreditPayment.js";
import type { TCreditPaymentEndpoint } from "../domain/types/TCreditPaymentEndpoint.js";
import { CreditPaymentService } from "../services/creditPaymentService.js";

export class CreditPaymentRepository implements ICreditPaymentRepository {
  private static instance: CreditPaymentRepository;
  private readonly creditPaymentService = CreditPaymentService.getInstance();

  public static getInstance(): CreditPaymentRepository {
    if (!CreditPaymentRepository.instance) {
      CreditPaymentRepository.instance = new CreditPaymentRepository();
    }
    return CreditPaymentRepository.instance;
  }

  get = async (id: number): Promise<TCreditPaymentEndpoint> => {
    const payment = await this.creditPaymentService.get(id);
    if (!payment) throw new Error("source not found");
    return payment;
  };

  getAll = async (credit_id?: number): Promise<TCreditPaymentEndpoint[]> => {
    const payments = await this.creditPaymentService.getAll(credit_id);
    return payments ?? [];
  };

  post = async (data: TCreditPayment): Promise<TCreditPaymentEndpoint> => {
    const payment = await this.creditPaymentService.post(data);
    if (!payment) throw new Error("error at create credit payment");
    return payment;
  };

  patch = async (id: number, data: TCreditPayment): Promise<TCreditPaymentEndpoint> => {
    const payment = await this.creditPaymentService.patch(id, data);
    if (!payment) throw new Error("error at update credit payment");
    return payment;
  };

  delete = async (id: number): Promise<TCreditPaymentEndpoint> => {
    const payment = await this.creditPaymentService.delete(id);
    if (!payment) throw new Error("error at delete credit payment");
    return payment;
  };
}
