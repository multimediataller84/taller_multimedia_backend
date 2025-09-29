import type { TInvoice } from "../types/TInvoice.js";
import type { TInvoiceEndpoint } from "../types/TInvoiceEndpoint.js";

export interface IInvoiceRepository {
  get: (uuid: string) => Promise<TInvoiceEndpoint>;
  getAll: () => Promise<TInvoiceEndpoint[]>;
  post: (data: TInvoice) => Promise<TInvoiceEndpoint>;
  delete: (id: number) => Promise<TInvoiceEndpoint>;
  patch: (id: number, data: TInvoice) => Promise<TInvoiceEndpoint>;
}
