import type { TPaymentMethod } from "../types/TPaymentMethod.js";
import type { TPaymentMethodEndpoint } from "../types/TPaymentMethodEndpoint.js";

export interface IPaymentMethodServices {
  get(id: number): Promise<TPaymentMethodEndpoint>;
  getAll(): Promise<TPaymentMethodEndpoint[]>;
  post(data: TPaymentMethod): Promise<TPaymentMethodEndpoint>;
  patch(id: number, data: TPaymentMethod): Promise<TPaymentMethodEndpoint>;
  delete(id: number): Promise<TPaymentMethodEndpoint>;
}
