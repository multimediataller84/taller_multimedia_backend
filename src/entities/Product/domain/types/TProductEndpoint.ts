import type { TProductStatus } from "./TProductStatus.js";

export type TProductEndpoint = {
  id: number;
  product_name: string;
  sku: string;
  category:  number;
  profit_margin: number;
  unit_price: number;
  total: number;
  stock: number;
  state: TProductStatus;
  createdAt: Date;
  updatedAt: Date;
};