import type { TPaymentMethod } from "../../../../domain/types/TPaymentMethod.js";

export type TCreditPayment = {
  credit_id: number;
  invoice_id: number;
  amount: number;
  payment_method: TPaymentMethod;
  note: string | null;
};
