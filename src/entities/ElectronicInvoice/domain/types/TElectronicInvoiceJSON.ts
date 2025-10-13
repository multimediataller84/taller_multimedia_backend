import type { TElectroniceInvoice } from "./TElectroniceInvoice.js";

export type TElectronicInvoiceJSON = TElectroniceInvoice & {
  id: number;
  fechaEmision: string;
  subtotal: number;
  impuestoTotal: number;
  total: number;
};
