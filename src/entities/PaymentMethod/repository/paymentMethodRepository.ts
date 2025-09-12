import type { IPaymentMethodRepository } from "../domain/interfaces/IPaymentMethodRepository.js";
import type { TPaymentMethod } from "../domain/types/TPaymentMethod.js";
import type { TPaymentMethodEndpoint } from "../domain/types/TPaymentMethodEndpoint.js";
import { PaymentMethodService } from "../services/paymentMethodService.js";

export class PaymentMethodRepository implements IPaymentMethodRepository {
  private static instance: PaymentMethodRepository;
  private readonly service = PaymentMethodService.getInstance();

  public static getInstance(): PaymentMethodRepository {
    if (!PaymentMethodRepository.instance) {
      PaymentMethodRepository.instance = new PaymentMethodRepository();
    }
    return PaymentMethodRepository.instance;
  }

  get = async (id: number): Promise<TPaymentMethodEndpoint> => {
    try {
      const method = await this.service.get(id);
      if (!method) throw new Error("payment method not found");
      return method;
    } catch (error) {
      throw error;
    }
  };

  getAll = async (): Promise<TPaymentMethodEndpoint[]> => {
    try {
      const methods = await this.service.getAll();
      if (!methods) throw new Error("payment methods not found");
      return methods;
    } catch (error) {
      throw error;
    }
  };

  post = async (data: TPaymentMethod): Promise<TPaymentMethodEndpoint> => {
    try {
      const created = await this.service.post(data);
      if (!created) throw new Error("error creating payment method");
      return created;
    } catch (error) {
      throw error;
    }
  };

  patch = async (id: number, data: TPaymentMethod): Promise<TPaymentMethodEndpoint> => {
    try {
      const updated = await this.service.patch(id, data);
      if (!updated) throw new Error("error updating payment method");
      return updated;
    } catch (error) {
      throw error;
    }
  };

  delete = async (id: number): Promise<TPaymentMethodEndpoint> => {
    try {
      const removed = await this.service.delete(id);
      if (!removed) throw new Error("error deleting payment method");
      return removed;
    } catch (error) {
      throw error;
    }
  };
}
