import express from "express";
import { TaxController } from "../controllers/taxController.js";

const taxController = TaxController.getInstance();
const taxRouter = express.Router();

/**
 * @openapi
 * tags:
 *   - name: Tax
 *     description: Endpoints to manage taxes
 */

/**
 * @openapi
 * /tax/all:
 *   get:
 *     summary: Get all taxes
 *     tags:
 *       - Tax
 *     responses:
 *       200:
 *         description: List of taxes
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/TTaxEndpoint'
 *       404:
 *         description: No taxes found
 */
taxRouter.post("/all", taxController.getAll);

/**
 * @openapi
 * /tax/{id}:
 *   get:
 *     summary: Get a tax by ID
 *     tags:
 *       - Tax
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: Tax ID
 *     responses:
 *       200:
 *         description: Tax found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/TTaxEndpoint'
 *       404:
 *         description: Tax not found
 */
taxRouter.get("/:id", taxController.get);

/**
 * @openapi
 * /tax:
 *   post:
 *     summary: Create a new tax
 *     tags:
 *       - Tax
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/TTax'
 *     responses:
 *       200:
 *         description: Tax created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/TTaxEndpoint'
 *       404:
 *         description: Error creating tax
 */
taxRouter.post("/", taxController.post);

/**
 * @openapi
 * /tax/{id}:
 *   patch:
 *     summary: Update a tax by ID
 *     tags:
 *       - Tax
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: Tax ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/TTax'
 *     responses:
 *       200:
 *         description: Tax updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/TTaxEndpoint'
 *       404:
 *         description: Error updating tax
 */
taxRouter.patch("/", taxController.patch);

/**
 * @openapi
 * /tax/{id}:
 *   delete:
 *     summary: Delete a tax by ID
 *     tags:
 *       - Tax
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: Tax ID
 *     responses:
 *       200:
 *         description: Tax deleted successfully
 *       404:
 *         description: Error deleting tax
 */
taxRouter.delete("/:id", taxController.delete);

export default taxRouter;

/**
 * @openapi
 * components:
 *   schemas:
 *     TTax:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *         percentage:
 *           type: number
 *         description:
 *           type: string
 *           nullable: true
 *       required:
 *         - name
 *         - percentage
 *     TTaxEndpoint:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *         name:
 *           type: string
 *         percentage:
 *           type: number
 *         description:
 *           type: string
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
 *         - percentage
 *         - createdAt
 *         - updatedAt
 */
