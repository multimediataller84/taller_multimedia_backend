import type { TCreditPayment } from "../types/TCreditPayment.js";
import type { TCreditPaymentEndpoint } from "../types/TCreditPaymentEndpoint.js";

export interface ICreditPaymentServices {
  get: (id: number) => Promise<TCreditPaymentEndpoint>;
  getAll: () => Promise<TCreditPaymentEndpoint[]>;
  getAllByUser: (id: number) => Promise<TCreditPaymentEndpoint[]>;
  post: (data: TCreditPayment) => Promise<TCreditPaymentEndpoint>;
  delete: (id: number) => Promise<TCreditPaymentEndpoint>;
  patch: (id: number, data: TCreditPayment) => Promise<TCreditPaymentEndpoint>;
}
