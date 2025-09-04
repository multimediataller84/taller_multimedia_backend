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
    try {
      const invoice = await this.creditPaymentService.get(id);
      if (!invoice) {
        throw new Error("source not found");
      }
      return invoice;
    } catch (error) {
      throw error;
    }
  };

  getAll = async (): Promise<TCreditPaymentEndpoint[]> => {
    try {
      const invoice = await this.creditPaymentService.getAll();
      if (invoice.length === 0) {
        throw new Error("sources not found");
      }
      return invoice;
    } catch (error) {
      throw error;
    }
  };

  post = async (data: TCreditPayment): Promise<TCreditPaymentEndpoint> => {
    try {
      const invoice = await this.creditPaymentService.post(data);
      if (!invoice) {
        throw new Error("error at create customer");
      }
      return invoice;
    } catch (error) {
      throw error;
    }
  };

  patch = async (id: number, data: TCreditPayment): Promise<TCreditPaymentEndpoint> => {
    try {
      const invoice = await this.creditPaymentService.patch(id, data);
      if (!invoice) {
        throw new Error("error at update source");
      }
      return invoice;
    } catch (error) {
      throw error;
    }
  };

  delete = async (id: number): Promise<TCreditPaymentEndpoint> => {
    try {
      const invoice = await this.creditPaymentService.delete(id);
      if (!invoice) {
        throw new Error("error at delete source");
      }
      return invoice;
    } catch (error) {
      throw error;
    }
  };
}
