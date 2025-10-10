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
  payment_method: TPaymentMethod;
  products: ProdutList[];
  status: TInvoiceStatus;
  digital_signature: string | null;
  biometric_hash: string | null;
};
