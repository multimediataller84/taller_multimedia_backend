import type { TPaymentMethod } from "../../../../domain/types/TPaymentMethod.js";
import type { TProduct } from "../../../Product/domain/types/TProduct.js";
import type { TInvoiceStatus } from "./TInvoiceStatus.js";

export type ProdutList = Omit<TProduct, "stock"> & {
  id: number;
  quantity: number;
};
export type TInvoice = {
  customer_id: number;
  due_date: Date | null;
  cash_register_id: number;
  user_id: number;
  payment_receipt?: string | null;
  payment_method: TPaymentMethod;
  products: ProdutList[];
  status: TInvoiceStatus;
  cash_given?: number;
  change_due?: number;
  digital_signature: string | null;
  biometric_hash: string | null;
  branch?: string | null;
  terminal?: string | null;
  type?: string | null;
  sequence?: number | null;
  consecutive?: string | null;
  consecutive_formatted?: string | null;
};
