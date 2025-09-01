import express from "express";
import { InvoiceDetailController } from "../controllers/invoiceDetailController.js";

const invoiceDetailController = InvoiceDetailController.getInstance();
const invoiceDetailRouter = express.Router();

/**
 * @openapi
 * tags:
 *   - name: InvoiceDetail
 *     description: Endpoints to manage invoice details
 */

/**
 * @openapi
 * /invoice/detail/all:
 *   get:
 *     summary: Get all invoice details
 *     tags:
 *       - InvoiceDetail
 *     responses:
 *       200:
 *         description: List of invoice details
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/TInvoiceDetailEndpoint'
 *       404:
 *         description: No details found
 */
invoiceDetailRouter.get("/all", invoiceDetailController.getAll);

/**
 * @openapi
 * /invoice/detail/{id}:
 *   get:
 *     summary: Get invoice detail by ID
 *     tags:
 *       - InvoiceDetail
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: Invoice detail ID
 *     responses:
 *       200:
 *         description: Detail found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/TInvoiceDetailEndpoint'
 *       404:
 *         description: Detail not found
 */
invoiceDetailRouter.get("/:id", invoiceDetailController.get);

/**
 * @openapi
 * /invoice/detail:
 *   post:
 *     summary: Create a new invoice detail
 *     tags:
 *       - InvoiceDetail
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/TInvoiceDetail'
 *     responses:
 *       200:
 *         description: Detail created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/TInvoiceDetailEndpoint'
 *       404:
 *         description: Error creating detail
 */
invoiceDetailRouter.post("/", invoiceDetailController.post);

/**
 * @openapi
 * /invoice/detail/{id}:
 *   patch:
 *     summary: Update an invoice detail by ID
 *     tags:
 *       - InvoiceDetail
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: Invoice detail ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/TInvoiceDetail'
 *     responses:
 *       200:
 *         description: Detail updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/TInvoiceDetailEndpoint'
 *       404:
 *         description: Error updating detail
 */
invoiceDetailRouter.patch("/:id", invoiceDetailController.patch);

/**
 * @openapi
 * /invoice/detail/{id}:
 *   delete:
 *     summary: Delete an invoice detail by ID
 *     tags:
 *       - InvoiceDetail
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: Invoice detail ID
 *     responses:
 *       200:
 *         description: Detail successfully removed
 *       404:
 *         description: Error when deleting detail
 */
invoiceDetailRouter.delete("/:id", invoiceDetailController.delete);

export default invoiceDetailRouter;

/**
 * @openapi
 * components:
 *   schemas:
 *     TInvoiceDetail:
 *       type: object
 *       properties:
 *         invoice_id:
 *           type: integer
 *         product_id:
 *           type: integer
 *         quantity:
 *           type: number
 *         unit_price:
 *           type: number
 *         discount:
 *           type: number
 *         subtotal:
 *           type: number
 *       required:
 *         - invoice_id
 *         - product_id
 *         - quantity
 *         - unit_price
 *         - discount
 *         - subtotal
 *     TInvoiceDetailEndpoint:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *         invoice_id:
 *           type: integer
 *         product_id:
 *           type: integer
 *         quantity:
 *           type: number
 *         unit_price:
 *           type: number
 *         discount:
 *           type: number
 *         subtotal:
 *           type: number
 *       required:
 *         - id
 *         - invoice_id
 *         - product_id
 *         - quantity
 *         - unit_price
 *         - discount
 *         - subtotal
 */
