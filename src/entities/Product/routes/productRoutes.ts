import express from "express";
import { ProductController } from "../controllers/productController.js";

const productController = ProductController.getInstance();
const productRouter = express.Router();

productRouter.get("/all", productController.getAll);
productRouter.get("/:id", productController.get);
productRouter.post("/", productController.post);
productRouter.patch("/:id", productController.patch);
productRouter.delete("/:id", productController.delete);

export default productRouter;
