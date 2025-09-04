import express from "express";
import { CreditController } from "../controllers/creditController.js";

const creditController = CreditController.getInstance();
const creditRouter = express.Router();

/**
 * @openapi
 * tags:
 *   - name: Credit
 *     description: Endpoints to manage credits assigned to invoices/customers
 */

/**
 * @openapi
 * /credit/all:
 *   get:
 *     summary: Get all credits
 *     tags:
 *       - Credit
 *     responses:
 *       200:
 *         description: List of credits
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/TCreditEndpoint'
 *       404:
 *         description: No credits found
 */
creditRouter.get("/all", creditController.getAll);

/**
 * @openapi
 * /credit/{id}:
 *   get:
 *     summary: Get a credit by ID
 *     tags:
 *       - Credit
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: Credit ID
 *     responses:
 *       200:
 *         description: Credit found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/TCreditEndpoint'
 *       404:
 *         description: Credit not found
 */
creditRouter.get("/:id", creditController.get);

/**
 * @openapi
 * /credit:
 *   post:
 *     summary: Create a new credit
 *     tags:
 *       - Credit
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/TCredit'
 *     responses:
 *       200:
 *         description: Credit created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/TCreditEndpoint'
 *       400:
 *         description: Error creating credit
 */
creditRouter.post("/", creditController.post);

/**
 * @openapi
 * /credit/{id}:
 *   patch:
 *     summary: Update a credit by ID
 *     tags:
 *       - Credit
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: Credit ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/TCredit'
 *     responses:
 *       200:
 *         description: Credit updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/TCreditEndpoint'
 *       400:
 *         description: Error updating credit
 */
creditRouter.patch("/:id", creditController.patch);

/**
 * @openapi
 * /credit/{id}:
 *   delete:
 *     summary: Delete a credit by ID
 *     tags:
 *       - Credit
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: Credit ID
 *     responses:
 *       200:
 *         description: Credit deleted successfully
 *       400:
 *         description: Error deleting credit
 */
creditRouter.delete("/:id", creditController.delete);

export default creditRouter;

/**
 * @openapi
 * components:
 *   schemas:
 *     TCredit:
 *       type: object
 *       properties:
 *         invoice_id:
 *           type: integer
 *         customer_id:
 *           type: integer
 *         credit_amount:
 *           type: number
 *         balance:
 *           type: number
 *         due_date:
 *           type: string
 *           format: date-time
 *         status:
 *           type: string
 *           enum: [active, paid, overdue, cancelled]
 *       required:
 *         - invoice_id
 *         - customer_id
 *         - credit_amount
 *         - balance
 *         - due_date
 *         - status
 *     TCreditEndpoint:
 *       allOf:
 *         - $ref: '#/components/schemas/TCredit'
 *         - type: object
 *           properties:
 *             id:
 *               type: integer
 *             createdAt:
 *               type: string
 *               format: date-time
 *             updatedAt:
 *               type: string
 *               format: date-time
 *           required:
 *             - id
 *             - createdAt
 *             - updatedA
 */
