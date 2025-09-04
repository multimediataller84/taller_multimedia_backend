export type TCreditPayment = {
  credit_id: number;
  payment_date: Date;
  amount: number;
  payment_method_id: number;
  note: string | null;
};
