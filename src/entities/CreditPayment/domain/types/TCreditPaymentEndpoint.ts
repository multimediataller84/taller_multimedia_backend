import type { TPaymentMethod } from "../../../../domain/types/TPaymentMethod.js";

export type TCreditPaymentEndpoint = {
  id: number;
  credit_id: number;
  invoice_id: number;
  payment_date: Date;
  amount:  number;
  payment_method: TPaymentMethod;
  note: string | null;
  createdAt: Date;
  updatedAt: Date;
};