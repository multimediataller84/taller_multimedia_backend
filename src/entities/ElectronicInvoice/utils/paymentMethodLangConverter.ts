import type { TPaymentMethod } from "../../../domain/types/TPaymentMethod.js";

export const paymentMethodLangMap: Record<TPaymentMethod, string> = {
  "Cash": "Efectivo",
  "Credit": "Crédito",
  "Debit Card": "Tarjeta de débito",
  "Transfer": "Transferencia bancaria",
};