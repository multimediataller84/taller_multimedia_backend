import type { TProductStatus } from "./TProductStatus.js";

export type TProductEndpoint = {
  id: number;
  product_name: string;
  sku: string;
  category_id: number;
  tax_id: number;
  profit_margin: number;
  unit_price: number;
  unit_measure_id: number;
  stock: number;
  state: TProductStatus;
  createdAt: Date;
  updatedAt: Date;
};
