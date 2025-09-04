import type { TCreditStatus } from "./TCreditStatus.js";

export type TCreditEndpoint = {
  id: number;
  invoice_id: number;
  customer_id: number;
  credit_amount:  number;
  balance: number;
  due_date: Date;
  status: TCreditStatus;
  createdAt: Date;
  updatedAt: Date;
};
