import type { TPaymentMethodTypes } from "./TPaymentMethodTypes.js";

export type TPaymentMethod = {
  name: TPaymentMethodTypes;
  description?: string;
};
