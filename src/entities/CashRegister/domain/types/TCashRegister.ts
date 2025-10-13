import type { TStatus } from "./TStatus.js";

export type TCashRegister = {
  amount: number;
  opening_amount: number;
  closing_amount: number | null;
  status: TStatus;
  user_id: number | null;
};
