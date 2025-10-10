import type { TPaymentMethod } from "../../../../domain/types/TPaymentMethod.js";
import type { TInvoiceStatus } from "./TInvoiceStatus.js";

export type TInvoiceEndpoint = {
  id: number;
  customer_id: number;
  issue_date: Date | null;
  due_date:  Date | null;
  subtotal: number;
  tax_total: number;
  total: number;
  cash_register_id: number;
  payment_method: TPaymentMethod;
  status: TInvoiceStatus;
  invoice_number: string;
  digital_signature: string | null;
  biometric_hash: string | null;
  createdAt: Date;
  updatedAt: Date;
};
