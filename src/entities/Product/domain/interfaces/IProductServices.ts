import type { TProduct } from "../types/TProduct.js";
import type { TProductEndpoint } from "../types/TProductEndpoint.js";

export interface IProductServices {
  get: (id: number) => Promise<TProductEndpoint>;
  getAll: () => Promise<TProductEndpoint[]>;
  post: (data: TProduct) => Promise<TProductEndpoint>;
  delete: (id: number) => Promise<TProductEndpoint>;
  patch: (id: number, data: TProduct) => Promise<TProductEndpoint>;
}
