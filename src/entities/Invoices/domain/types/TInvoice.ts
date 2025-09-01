export type TInvoice = {
  customer_id: number;
  issue_date: Date;
  due_date: Date | null;
  subtotal: number;
  tax_total: number;
  total: number;
  payment_method_id: number;
  status_id: number;
  invoice_number: string;
  digital_signature: string | null;
  biometric_hash: string | null;
};
