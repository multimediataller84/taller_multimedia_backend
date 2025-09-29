import type { TCreditStatus } from "./TCreditStatus.js";

export type TCredit = {
  customer_id: number;
  approved_credit_amount: number;
  balance: number;
  status: TCreditStatus;
};
