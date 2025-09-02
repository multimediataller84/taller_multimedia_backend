import type { TCategory } from "../types/TCategory.js";
import type { TCategoryEndpoint } from "../types/TCategoryEndpoint.js";

export interface ICategoryServices {
  get: (id: number) => Promise<TCategoryEndpoint>;
  getAll: () => Promise<TCategoryEndpoint[]>;
  post: (data: TCategory) => Promise<TCategoryEndpoint>;
  delete: (id: number) => Promise<TCategoryEndpoint>;
  patch: (id: number, data: TCategory) => Promise<TCategoryEndpoint>;
}
