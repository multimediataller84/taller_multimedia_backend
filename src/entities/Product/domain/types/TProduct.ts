import type { TProductStatus } from "./TProductStatus.js";

export type TProduct = {
  product_name: string;
  sku: string;
  cabys_code: string;
  category_id:  number;
  tax_id: number;
  profit_margin: number;
  unit_price: number;
  total: number;
  stock: number;
  state: TProductStatus;
};
