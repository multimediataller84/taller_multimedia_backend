import express from "express";
import { ProductController } from "../controllers/productController.js";

const productController = ProductController.getInstance();
const productRouter = express.Router();

/**
 * @openapi
 * tags:
 *   - name: Product
 *     description: Endpoints for managing products
 */

/**
 * @openapi
 * /product/all:
 *   get:
 *     summary: Get all the products
 *     tags:
 *       - Product
 *     responses:
 *       200:
 *         description: Product List
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/TProductEndpoint'
 *       404:
 *         description: No products found
 */
productRouter.post("/all", productController.getAll);

/**
 * @openapi
 * tags:
 *   - name: Product
 *     description: Endpoints for managing products
 */

/**
 * @openapi
 * /measure/all:
 *   get:
 *     summary: Get all the unit measure
 *     tags:
 *       - Measure
 *     responses:
 *       200:
 *         description: UnitMeasure List
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/TProductEndpoint'
 *       404:
 *         description: No measures found
 */
productRouter.get("/measure/all", productController.getAllMeasure);

/**
 * @openapi
 * /product/{id}:
 *   get:
 *     summary: Get a product by ID
 *     tags:
 *       - Product
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: Product ID
 *     responses:
 *       200:
 *         description: Product found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/TProductEndpoint'
 *       404:
 *         description: Product not found
 */
productRouter.get("/:id", productController.get);

/**
 * @openapi
 * /product:
 *   post:
 *     summary: Create a new product
 *     tags:
 *       - Product
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/TProduct'
 *     responses:
 *       200:
 *         description: Successfully created product
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/TProductEndpoint'
 *       403:
 *         description: Error creating product
 */
productRouter.post("/", productController.post);

/**
 * @openapi
 * /product/{id}:
 *   patch:
 *     summary: Update a product by ID
 *     tags:
 *       - Product
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: Product ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/TProduct'
 *     responses:
 *       200:
 *         description: Successfully updated product
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/TProductEndpoint'
 *       404:
 *         description: Error updating product
 */
productRouter.patch("/:id", productController.patch);

/**
 * @openapi
 * /product/{id}:
 *   delete:
 *     summary: Delete a product by ID
 *     tags:
 *       - Product
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID del producto
 *     responses:
 *       200:
 *         description: Product disposed correctly
 *       404:
 *         description: Product deletion error
 */
productRouter.delete("/:id", productController.delete);

export default productRouter;

/**
 * @openapi
 * components:
 *   schemas:
 *     TProductStatus:
 *       type: string
 *       enum:
 *         - active
 *         - inactive
 *         - discontinued
 *     TProduct:
 *       type: object
 *       properties:
 *         product_name:
 *           type: string
 *         sku:
 *           type: string
 *         category:
 *           type: integer
 *         profit_margin:
 *           type: number
 *         unit_price:
 *           type: number
 *         total:
 *           type: number
 *         stock:
 *           type: number
 *         state:
 *           $ref: '#/components/schemas/TProductStatus'
 *       required:
 *         - product_name
 *         - sku
 *         - category
 *         - profit_margin
 *         - unit_price
 *         - total
 *         - stock
 *         - state
 *     TProductEndpoint:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *         product_name:
 *           type: string
 *         sku:
 *           type: string
 *         category:
 *           type: integer
 *         profit_margin:
 *           type: number
 *         unit_price:
 *           type: number
 *         total:
 *           type: number
 *         stock:
 *           type: number
 *         state:
 *           $ref: '#/components/schemas/TProductStatus'
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *       required:
 *         - id
 *         - product_name
 *         - sku
 *         - category
 *         - profit_margin
 *         - unit_price
 *         - total
 *         - stock
 *         - state
 *         - createdAt
 *         - updatedAt
 */