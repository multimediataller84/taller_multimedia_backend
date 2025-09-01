import type { TCustomer } from "../types/TCustomer.js";
import type { TCustomerEndpoint } from "../types/TCustomerEndpoint.js";

export interface ICustomerServices {
  get: (id: number) => Promise<TCustomerEndpoint>;
  getAll: () => Promise<TCustomerEndpoint[]>;
  post: (data: TCustomer) =>Promise<TCustomerEndpoint>;
  delete: (id: number) => Promise<TCustomerEndpoint>;
  patch: (id: number, data: TCustomer) => Promise<TCustomerEndpoint>;  
}
