import type { TPaymentMethod } from "../../../../domain/types/TPaymentMethod.js";

export type TCreditPayment = {
  credit_id: number;
  payment_date: Date;
  amount: number;
  payment_method: TPaymentMethod;
  note: string | null;
};
