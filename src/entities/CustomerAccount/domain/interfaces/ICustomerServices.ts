import type { TCanton } from "../types/TCanton.js";
import type { TDistrict } from "../types/TDistrict.js";
import type { TProvince } from "../types/TProvince.js";
import type { TCustomer } from "../types/TCustomer.js";
import type { TCustomerEndpoint } from "../types/TCustomerEndpoint.js";

export interface ICustomerServices {
  get: (id: number) => Promise<TCustomerEndpoint>;
  getAll: () => Promise<TCustomerEndpoint[]>;
  getAllProvince: () => Promise<TProvince[]>;
  getAllCanton: () => Promise<TCanton[]>;
  getAllDistrict: () => Promise<TDistrict[]>;
  post: (data: TCustomer) => Promise<TCustomerEndpoint>;
  delete: (id: number) => Promise<TCustomerEndpoint>;
  patch: (id: number, data: TCustomer) => Promise<TCustomerEndpoint>;
}
