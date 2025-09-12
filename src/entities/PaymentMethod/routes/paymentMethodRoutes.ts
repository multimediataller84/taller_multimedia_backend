import express from "express";
import { PaymentMethodController } from "../controllers/paymentMethodController.js";

const paymentMethodController = PaymentMethodController.getInstance();
const paymentMethodRouter = express.Router();

/**
 * @openapi
 * tags:
 *   - name: PaymentMethod
 *     description: Endpoints to manage payment methods
 */

/**
 * @openapi
 * /payment-method/all:
 *   get:
 *     summary: Gets all payment methods
 *     tags:
 *       - PaymentMethod
 *     responses:
 *       200:
 *         description: List of payment methods
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/TPaymentMethodEndpoint'
 *       404:
 *         description: No payment methods found
 */
paymentMethodRouter.get("/all", paymentMethodController.getAll);

/**
 * @openapi
 * /payment-method/{id}:
 *   get:
 *     summary: Get a payment method by ID
 *     tags:
 *       - PaymentMethod
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: Payment method ID
 *     responses:
 *       200:
 *         description: Payment method found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/TPaymentMethodEndpoint'
 *       404:
 *         description: Payment method not found
 */
paymentMethodRouter.get("/:id", paymentMethodController.get);

/**
 * @openapi
 * /payment-method:
 *   post:
 *     summary: Create a new payment method
 *     tags:
 *       - PaymentMethod
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/TPaymentMethod'
 *     responses:
 *       200:
 *         description: Successfully created payment method
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/TPaymentMethodEndpoint'
 *       404:
 *         description: Error creating payment method
 */
paymentMethodRouter.post("/", paymentMethodController.post);

/**
 * @openapi
 * /payment-method/{id}:
 *   patch:
 *     summary: Update a payment method by ID
 *     tags:
 *       - PaymentMethod
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: Payment method ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/TPaymentMethod'
 *     responses:
 *       200:
 *         description: Payment method updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/TPaymentMethodEndpoint'
 *       404:
 *         description: Error updating payment method
 */
paymentMethodRouter.patch("/:id", paymentMethodController.patch);

/**
 * @openapi
 * /payment-method/{id}:
 *   delete:
 *     summary: Delete a payment method by ID
 *     tags:
 *       - PaymentMethod
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: Payment method ID
 *     responses:
 *       200:
 *         description: Successfully deleted payment method
 *       404:
 *         description: Error deleting payment method
 */
paymentMethodRouter.delete("/:id", paymentMethodController.delete);

export default paymentMethodRouter;

/**
 * @openapi
 * components:
 *   schemas:
 *     TPaymentMethod:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *           enum: [cash, card, transfer, mobile, check]
 *         description:
 *           type: string
 *           nullable: true
 *       required:
 *         - name
 *     TPaymentMethodEndpoint:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *         name:
 *           type: string
 *         description:
 *           type: string
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *       required:
 *         - id
 *         - name
 *         - description
 *         - createdAt
 *         - updatedAt
 */
