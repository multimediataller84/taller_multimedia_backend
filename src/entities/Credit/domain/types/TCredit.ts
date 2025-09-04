import type { TCreditStatus } from "./TCreditStatus.js";

export type TCredit = {
  invoice_id: number;
  customer_id: number;
  credit_amount: number;
  balance: number;
  due_date: Date;
  status: TCreditStatus;
};
