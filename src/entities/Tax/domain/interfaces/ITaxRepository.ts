import type { GetAllOptions } from "../../../../domain/types/TGetAllOptions.js";
import type { TGetAllEnpoint } from "../types/TGetAllEndpoint.js";
import type { TTax } from "../types/TTax.js";
import type { TTaxEndpoint } from "../types/TTaxEndpoint.js";

export interface ITaxRepository {
  get: (id: number) => Promise<TTaxEndpoint>;
  getAll: (options: GetAllOptions) => Promise<TGetAllEnpoint>;
  post: (data: TTax) => Promise<TTaxEndpoint>;
  delete: (id: number) => Promise<TTaxEndpoint>;
  patch: (data: TTax) => Promise<TTaxEndpoint>;
}
