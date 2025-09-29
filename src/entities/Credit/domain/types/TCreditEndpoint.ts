import type { TCreditStatus } from "./TCreditStatus.js";

export type TCreditEndpoint = {
  id: number;
  customer_id: number;
  approved_credit_amount: number;
  balance: number;
  status: TCreditStatus;
  createdAt: Date;
  updatedAt: Date;
};
