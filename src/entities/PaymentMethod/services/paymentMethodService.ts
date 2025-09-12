import type { IPaymentMethodServices } from "../domain/interfaces/IPaymentMethodServices.js";
import PaymentMethod from "../domain/models/PaymentMethodModel.js";
import type { TPaymentMethod } from "../domain/types/TPaymentMethod.js";
import type { TPaymentMethodEndpoint } from "../domain/types/TPaymentMethodEndpoint.js";

const ALLOWED_METHODS: ReadonlyArray<string> = [
  "cash",
  "card",
  "transfer",
  "mobile",
  "check",
];

export class PaymentMethodService implements IPaymentMethodServices {
  private static instance: PaymentMethodService;

  public static getInstance(): PaymentMethodService {
    if (!PaymentMethodService.instance) {
      PaymentMethodService.instance = new PaymentMethodService();
    }
    return PaymentMethodService.instance;
  }

  get = async (id: number): Promise<TPaymentMethodEndpoint> => {
    try {
      const method = await PaymentMethod.findByPk(id);
      if (!method) throw new Error("payment method not found");
      return method;
    } catch (error) {
      throw error;
    }
  };

  getAll = async (): Promise<TPaymentMethodEndpoint[]> => {
    try {
      const methods = await PaymentMethod.findAll();
      if (methods.length === 0) throw new Error("payment methods not found");
      return methods;
    } catch (error) {
      throw error;
    }
  };

  post = async (data: TPaymentMethod): Promise<TPaymentMethodEndpoint> => {
    try {
      const { name } = data;
      if (!name) throw new Error("name is required");
      if (!ALLOWED_METHODS.includes(name)) throw new Error("invalid payment method name");

      const exists = await PaymentMethod.findOne({ where: { name } });
      if (exists) throw new Error("name already exists");

      const created = await PaymentMethod.create({
        name,
        ...(data.description !== undefined ? { description: data.description } : {}),
      });

      return created;
    } catch (error) {
      throw error;
    }
  };

  patch = async (id: number, data: TPaymentMethod): Promise<TPaymentMethodEndpoint> => {
    try {
      const method = await PaymentMethod.findByPk(id);
      if (!method) throw new Error("payment method not found");

      if (data.name) {
        if (!ALLOWED_METHODS.includes(data.name)) throw new Error("invalid payment method name");
        if (data.name !== method.name) {
          const exists = await PaymentMethod.findOne({ where: { name: data.name } });
          if (exists) throw new Error("name already exists");
        }
      }

      await method.update(data);
      return method;
    } catch (error) {
      throw error;
    }
  };

  delete = async (id: number): Promise<TPaymentMethodEndpoint> => {
    try {
      const method = await PaymentMethod.findByPk(id);
      if (!method) throw new Error("payment method not found");

      await method.destroy();
      return method;
    } catch (error) {
      throw error;
    }
  };
}
