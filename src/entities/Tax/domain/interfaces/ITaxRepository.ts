import type { TTax } from "../types/TTax.js";
import type { TTaxEndpoint } from "../types/TTaxEndpoint.js";

export interface ITaxRepository {
  get: (id: number) => Promise<TTaxEndpoint>;
  getAll: () => Promise<TTaxEndpoint[]>;
  post: (data: TTax) => Promise<TTaxEndpoint>;
  delete: (id: number) => Promise<TTaxEndpoint>;
  patch: (id: number, data: TTax) => Promise<TTaxEndpoint>;
  updateAll: (file: Express.Multer.File) => Promise<any>;
}
