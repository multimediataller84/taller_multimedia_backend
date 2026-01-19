import type { TElectroniceInvoice } from "./TElectroniceInvoice.js";

export type TElectronicInvoiceJSON = TElectroniceInvoice & {
  id: number;
  subtotal: number;
  impuestoTotal: number;
  total: number;
  clave?: string;
};
