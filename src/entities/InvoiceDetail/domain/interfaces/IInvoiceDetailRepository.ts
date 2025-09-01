import type { TInvoiceDetail } from "../types/TInvoiceDetail.js";
import type { TInvoiceDetailEndpoint } from "../types/TInvoiceDetailEndpoint.js";

export interface IInvoiceDetailRepository {
  get: (id: number) => Promise<TInvoiceDetailEndpoint>;
  getAll: () => Promise<TInvoiceDetailEndpoint[]>;
  post: (data: TInvoiceDetail) => Promise<TInvoiceDetailEndpoint>;
  delete: (id: number) => Promise<TInvoiceDetailEndpoint>;
  patch: (id: number, data: TInvoiceDetail) => Promise<TInvoiceDetailEndpoint>;
}