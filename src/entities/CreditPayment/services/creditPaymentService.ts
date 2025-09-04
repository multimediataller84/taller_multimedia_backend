import CreditPayment from "../domain/models/CreditPaymentModel.js";
import type { ICreditPaymentServices } from "../domain/interfaces/ICreditPaymentServices.js";
import type { TCreditPaymentEndpoint } from "../domain/types/TCreditPaymentEndpoint.js";
import type { TCreditPayment } from "../domain/types/TCreditPayment.js";

export class CreditPaymentService implements ICreditPaymentServices {
  private static instance: CreditPaymentService;

  public static getInstance(): CreditPaymentService {
    if (!CreditPaymentService.instance) {
      CreditPaymentService.instance = new CreditPaymentService();
    }
    return CreditPaymentService.instance;
  }

  get = async (id: number): Promise<TCreditPaymentEndpoint> => {
    try {
      const payment = await CreditPayment.findByPk(id);
      if (!payment) {
        throw new Error("payment not found");
      }
      return payment;
    } catch (error) {
      throw error;
    }
  };

  getAll = async (): Promise<TCreditPaymentEndpoint[]> => {
    try {
      const payment = await CreditPayment.findAll();
      if (payment.length === 0) {
        throw new Error("payment not found");
      }
      return payment;
    } catch (error) {
      throw error;
    }
  };

  post = async (data: TCreditPayment): Promise<TCreditPaymentEndpoint> => {
    try {
      const payment = await CreditPayment.create(data);
      return payment;
    } catch (error) {
      throw error;
    }
  };

  patch = async (
    id: number,
    data: TCreditPayment
  ): Promise<TCreditPaymentEndpoint> => {
    try {
      const payment = await CreditPayment.findByPk(id);
      if (!payment) {
        throw new Error("payment not found");
      }
      await payment.update(data);
      return payment;
    } catch (error) {
      throw error;
    }
  };

  delete = async (id: number): Promise<TCreditPaymentEndpoint> => {
    try {
      const payment = await CreditPayment.findByPk(id);
      if (!payment) {
        throw new Error("payment not found");
      }
      await payment.destroy();
      return payment;
    } catch (error) {
      throw error;
    }
  };
}
