import express from "express";
import { CreditPaymentController } from "../controllers/creditPaymentController.js";

const creditPaymentController = CreditPaymentController.getInstance();
const creditPaymentRouter = express.Router();

/**
 * @openapi
 * tags:
 *   - name: CreditPayment
 *     description: Endpoints to manage credit payments (installments, partial payments)
 */

/**
 * @openapi
 * /credit-payment/all:
 *   get:
 *     summary: Get all credit payments
 *     tags:
 *       - CreditPayment
 *     parameters:
 *       - in: query
 *         name: credit_id
 *         schema:
 *           type: integer
 *         required: false
 *         description: Filters payments by credit_id
 *     responses:
 *       200:
 *         description: List of credit payments
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/TCreditPaymentEndpoint'
 *       404:
 *         description: No credit payments found
 */
creditPaymentRouter.get("/all", creditPaymentController.getAll);

creditPaymentRouter.get("/:id/all", creditPaymentController.getAllByUser);

/**
 * @openapi
 * /credit-payment/{id}:
 *   get:
 *     summary: Get a credit payment by ID
 *     tags:
 *       - CreditPayment
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: Credit payment ID
 *     responses:
 *       200:
 *         description: Credit payment found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/TCreditPaymentEndpoint'
 *       404:
 *         description: Credit payment not found
 */
creditPaymentRouter.get("/:id", creditPaymentController.get);

/**
 * @openapi
 * /credit-payment:
 *   post:
 *     summary: Create a new credit payment
 *     tags:
 *       - CreditPayment
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/TCreditPayment'
 *     responses:
 *       200:
 *         description: Credit payment created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/TCreditPaymentEndpoint'
 *       400:
 *         description: Error creating credit payment
 */
creditPaymentRouter.post("/", creditPaymentController.post);

/**
 * @openapi
 * /credit-payment/{id}:
 *   patch:
 *     summary: Update a credit payment by ID
 *     tags:
 *       - CreditPayment
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: Credit payment ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/TCreditPayment'
 *     responses:
 *       200:
 *         description: Credit payment updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/TCreditPaymentEndpoint'
 *       400:
 *         description: Error updating credit payment
 */
creditPaymentRouter.patch("/:id", creditPaymentController.patch);

/**
 * @openapi
 * /credit-payment/{id}:
 *   delete:
 *     summary: Delete a credit payment by ID
 *     tags:
 *       - CreditPayment
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: Credit payment ID
 *     responses:
 *       200:
 *         description: Credit payment deleted successfully
 *       400:
 *         description: Error deleting credit payment
 */
creditPaymentRouter.delete("/:id", creditPaymentController.delete);

// GET /credit/payment/all  (con el mismo controlador que ya lee credit_id)
creditPaymentRouter.get(
  "/../credit/payment/all",
  creditPaymentController.getAll
);
// GET /credit/payment/:id
creditPaymentRouter.get("/../credit/payment/:id", creditPaymentController.get);
// POST /credit/payment
creditPaymentRouter.post("/../credit/payment", creditPaymentController.post);
// PATCH /credit/payment/:id
creditPaymentRouter.patch(
  "/../credit/payment/:id",
  creditPaymentController.patch
);
// DELETE /credit/payment/:id
creditPaymentRouter.delete(
  "/../credit/payment/:id",
  creditPaymentController.delete
);

export default creditPaymentRouter;

/**
 * @openapi
 * components:
 *   schemas:
 *     TCreditPayment:
 *       type: object
 *       properties:
 *         credit_id:
 *           type: integer
 *         payment_date:
 *           type: string
 *           format: date-time
 *         amount:
 *           type: number
 *         payment_method_id:
 *           type: integer
 *         note:
 *           type: string
 *           nullable: true
 *       required:
 *         - credit_id
 *         - payment_date
 *         - amount
 *         - payment_method_id
 *     TCreditPaymentEndpoint:
 *       allOf:
 *         - $ref: '#/components/schemas/TCreditPayment'
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
 *             - updatedAt
 */
