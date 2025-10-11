import express from "express";
import { InvoiceController } from "../controllers/invoiceController.js";

const invoiceController = InvoiceController.getInstance();
const invoiceRouter = express.Router();

/**
 * @openapi
 * tags:
 *   - name: Invoice
 *     description: Endpoints for managing invoices
 */

/**
 * @openapi
 * /invoice/all:
 *   get:
 *     summary: Get all invoices
 *     tags:
 *       - Invoice
 *     responses:
 *       200:
 *         description: Invoice list
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/TInvoiceEndpoint'
 *       404:
 *         description: No invoices found
 */
invoiceRouter.get("/all", invoiceController.getAll);

/**
 * @openapi
 * /invoice/{id}:
 *   get:
 *     summary: Get an invoice by ID
 *     tags:
 *       - Invoice
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: Invoice ID
 *     responses:
 *       200:
 *         description: Invoice found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/TInvoiceEndpoint'
 *       404:
 *         description: Invoice not found
 */
invoiceRouter.get("/:uuid", invoiceController.get);

/**
 * @openapi
 * /invoice:
 *   post:
 *     summary: Create a new invoice
 *     tags:
 *       - Invoice
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/TInvoice'
 *     responses:
 *       200:
 *         description: Invoice created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/TInvoiceEndpoint'
 *       404:
 *         description: Error creating invoice
 */
invoiceRouter.post("/", invoiceController.post);

/**
 * @openapi
 * /invoice/{id}:
 *   patch:
 *     summary: Update an invoice by ID
 *     tags:
 *       - Invoice
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: Invoice ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/TInvoice'
 *     responses:
 *       200:
 *         description: Invoice updated correctly
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/TInvoiceEndpoint'
 *       404:
 *         description: Error updating invoice
 */
invoiceRouter.patch("/:id", invoiceController.patch);

/**
 * @openapi
 * /invoice/{id}:
 *   delete:
 *     summary: Delete an invoice by ID
 *     tags:
 *       - Invoice
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: Invoice ID
 *     responses:
 *       200:
 *         description: Invoice successfully deleted
 *       404:
 *         description: Error deleting invoice
 */
invoiceRouter.delete("/:id", invoiceController.delete);

invoiceRouter.get("/pdf/:name", invoiceController.getPdf);

export default invoiceRouter;

/**
 * @openapi
 * components:
 *   schemas:
 *     TInvoice:
 *       type: object
 *       properties:
 *         customer_id:
 *           type: integer
 *         issue_date:
 *           type: string
 *           format: date-time
 *         due_date:
 *           type: string
 *           format: date-time
 *           nullable: true
 *         subtotal:
 *           type: number
 *         tax_total:
 *           type: number
 *         total:
 *           type: number
 *         payment_method_id:
 *           type: integer
 *         status_id:
 *           type: integer
 *         invoice_number:
 *           type: string
 *         digital_signature:
 *           type: string
 *           nullable: true
 *         biometric_hash:
 *           type: string
 *           nullable: true
 *       required:
 *         - customer_id
 *         - issue_date
 *         - subtotal
 *         - tax_total
 *         - total
 *         - payment_method_id
 *         - status_id
 *         - invoice_number
 *     TInvoiceEndpoint:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *         customer_id:
 *           type: integer
 *         issue_date:
 *           type: string
 *           format: date-time
 *         due_date:
 *           type: string
 *           format: date-time
 *           nullable: true
 *         subtotal:
 *           type: number
 *         tax_total:
 *           type: number
 *         total:
 *           type: number
 *         payment_method_id:
 *           type: integer
 *         status_id:
 *           type: integer
 *         invoice_number:
 *           type: string
 *         digital_signature:
 *           type: string
 *           nullable: true
 *         biometric_hash:
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
 *         - customer_id
 *         - issue_date
 *         - subtotal
 *         - tax_total
 *         - total
 *         - payment_method_id
 *         - status_id
 *         - invoice_number
 *         - createdAt
 *         - updatedAt
 */