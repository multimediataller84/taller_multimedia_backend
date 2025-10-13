import type Product from "../../../Product/domain/models/ProductModel.js";

export type TProductDetails = {
  product: Product;
  quantity: number;
  subtotal: number;
  unit_price: number;
};
