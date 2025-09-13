import type { TGetAllOptions } from "../../../../domain/types/TGetAllOptions.js";
import type { TGetAllEnpoint } from "../types/TGetAllOptions.js";
import type { TProduct } from "../types/TProduct.js";
import type { TProductEndpoint } from "../types/TProductEndpoint.js";

export interface IProductServices {
  get: (id: number) => Promise<TProductEndpoint>;
  getAll: (options: TGetAllOptions) => Promise<TGetAllEnpoint>;
  post: (data: TProduct) => Promise<TProductEndpoint>;
  delete: (id: number) => Promise<TProductEndpoint>;
  patch: (id: number, data: TProduct) => Promise<TProductEndpoint>;
}
