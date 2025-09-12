import express from "express";
import { CreditStatusController } from "../controllers/creditStatusController.js";

const creditStatusController = CreditStatusController.getInstance();
const creditStatusRouter = express.Router();

/**
 * @openapi
 * tags:
 *   - name: CreditStatus
 *     description: Endpoints to manage credit statuses
 */

/**
 * @openapi
 * /credit-status/all:
 *   get:
 *     summary: Gets all credit statuses
 *     tags:
 *       - CreditStatus
 *     responses:
 *       200:
 *         description: List of credit statuses
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/TCreditStatusEndpoint'
 *       404:
 *         description: No credit statuses found
 */
creditStatusRouter.get("/all", creditStatusController.getAll);

/**
 * @openapi
 * /credit-status/{id}:
 *   get:
 *     summary: Get a credit status by ID
 *     tags:
 *       - CreditStatus
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: Credit status ID
 *     responses:
 *       200:
 *         description: Credit status found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/TCreditStatusEndpoint'
 *       404:
 *         description: Credit status not found
 */
creditStatusRouter.get("/:id", creditStatusController.get);

/**
 * @openapi
 * /credit-status:
 *   post:
 *     summary: Create a new credit status
 *     tags:
 *       - CreditStatus
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/TCreditStatus'
 *     responses:
 *       200:
 *         description: Successfully created credit status
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/TCreditStatusEndpoint'
 *       404:
 *         description: Error creating credit status
 */
creditStatusRouter.post("/", creditStatusController.post);

/**
 * @openapi
 * /credit-status/{id}:
 *   patch:
 *     summary: Update a credit status by ID
 *     tags:
 *       - CreditStatus
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: Credit status ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/TCreditStatus'
 *     responses:
 *       200:
 *         description: Credit status updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/TCreditStatusEndpoint'
 *       404:
 *         description: Error updating credit status
 */
creditStatusRouter.patch("/:id", creditStatusController.patch);

/**
 * @openapi
 * /credit-status/{id}:
 *   delete:
 *     summary: Delete a credit status by ID
 *     tags:
 *       - CreditStatus
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: Credit status ID
 *     responses:
 *       200:
 *         description: Successfully deleted credit status
 *       404:
 *         description: Error deleting credit status
 */
creditStatusRouter.delete("/:id", creditStatusController.delete);

export default creditStatusRouter;

/**
 * @openapi
 * components:
 *   schemas:
 *     TCreditStatus:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *           enum: [pending, approved, rejected, paid, cancelled]
 *         description:
 *           type: string
 *           nullable: true
 *       required:
 *         - name
 *     TCreditStatusEndpoint:
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
