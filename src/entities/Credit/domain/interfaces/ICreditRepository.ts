import type { TCredit } from "../types/TCredit.js";
import type { TCreditEndpoint } from "../types/TCreditEndpoint.js";

export interface ICreditRepository {
  get: (id: number) => Promise<TCreditEndpoint>;
  getAll: () => Promise<TCreditEndpoint[]>;
  post: (data: TCredit) => Promise<TCreditEndpoint>;
  delete: (id: number) => Promise<TCreditEndpoint>;
  patch: (id: number, data: TCredit) => Promise<TCreditEndpoint>;
}
