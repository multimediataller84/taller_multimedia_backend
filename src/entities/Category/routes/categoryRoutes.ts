import express from "express";
import { CategoryController } from "../controllers/categoryController.js";

const categoryController = CategoryController.getInstance();
const categoryRouter = express.Router();

/**
 * @openapi
 * tags:
 *   - name: Category
 *     description: Endpoints to manage product categories
 */

/**
 * @openapi
 * /category/all:
 *   get:
 *     summary: Get all categories
 *     tags:
 *       - Category
 *     responses:
 *       200:
 *         description: List of categories
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/TCategoryEndpoint'
 *       404:
 *         description: No categories found
 */
categoryRouter.get("/all", categoryController.getAll);

/**
 * @openapi
 * /category/{id}:
 *   get:
 *     summary: Get a category by ID
 *     tags:
 *       - Category
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: Category ID
 *     responses:
 *       200:
 *         description: Category found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/TCategoryEndpoint'
 *       404:
 *         description: Category not found
 */
categoryRouter.get("/:id", categoryController.get);

/**
 * @openapi
 * /category:
 *   post:
 *     summary: Create a new category
 *     tags:
 *       - Category
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/TCategory'
 *     responses:
 *       200:
 *         description: Category created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/TCategoryEndpoint'
 *       404:
 *         description: Error creating category
 */
categoryRouter.post("/", categoryController.post);

/**
 * @openapi
 * /category/{id}:
 *   patch:
 *     summary: Update a category by ID
 *     tags:
 *       - Category
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: Category ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/TCategory'
 *     responses:
 *       200:
 *         description: Category updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/TCategoryEndpoint'
 *       404:
 *         description: Error updating category
 */
categoryRouter.patch("/:id", categoryController.patch);

/**
 * @openapi
 * /category/{id}:
 *   delete:
 *     summary: Delete a category by ID
 *     tags:
 *       - Category
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: Category ID
 *     responses:
 *       200:
 *         description: Category deleted successfully
 *       404:
 *         description: Error deleting category
 */
categoryRouter.delete("/:id", categoryController.delete);

export default categoryRouter;

/**
 * @openapi
 * components:
 *   schemas:
 *     TCategory:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *         description:
 *           type: string
 *           nullable: true
 *         tax_id:
 *           type: integer
 *           nullable: true
 *       required:
 *         - name
 *     TCategoryEndpoint:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *         name:
 *           type: string
 *         description:
 *           type: string
 *           nullable: true
 *         tax_id:
 *           type: integer
 *           nullable: true
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *       required:
 *         - id
 *         - name
 *         - createdAt
 *         - updatedAt
 */
