import express from "express";
import { CustomerController } from "../controllers/customerController.js";

const customerController = CustomerController.getInstance();
const customerRouter = express.Router();

/**
 * @openapi
 * tags:
 *   - name: Customer
 *     description: Endpoints to manage clients
 */

/**
 * @openapi
 * /customer/all:
 *   get:
 *     summary: Get all the clients
 *     tags:
 *       - Customer
 *     responses:
 *       200:
 *         description: Client List
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/TCustomerEndpoint'
 *       404:
 *         description: No clients found
 */
customerRouter.get("/all", customerController.getAll);

customerRouter.get("/province/all", customerController.getAllProvince);
customerRouter.get("/canton/all", customerController.getAllCanton);
customerRouter.get("/district/all", customerController.getAllDistrict);

/**
 * @openapi
 * /customer/{id}:
 *   get:
 *     summary: Get a client by ID
 *     tags:
 *       - Customer
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: Client ID
 *     responses:
 *       200:
 *         description: Client found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/TCustomerEndpoint'
 *       404:
 *         description: Client not found
 */
customerRouter.get("/:id", customerController.get);

/**
 * @openapi
 * /customer:
 *   post:
 *     summary: Create a new client
 *     tags:
 *       - Customer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/TCustomer'
 *     responses:
 *       200:
 *         description: Successfully created client
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/TCustomerEndpoint'
 *       404:
 *         description: Error creating client
 */
customerRouter.post("/", customerController.post);

/**
 * @openapi
 * /customer/{id}:
 *   patch:
 *     summary: Update a client by ID
 *     tags:
 *       - Customer
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: Client ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/TCustomer'
 *     responses:
 *       200:
 *         description: Successfully updated client
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/TCustomerEndpoint'
 *       404:
 *         description: Error updating client
 */
customerRouter.patch("/:id", customerController.patch);

/**
 * @openapi
 * /customer/{id}:
 *   delete:
 *     summary: Delete a customer by ID
 *     tags:
 *       - Customer
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: Client ID
 *     responses:
 *       200:
 *         description: Successfully deleted client
 *       404:
 *         description: Error when deleting client
 */
customerRouter.delete("/:id", customerController.delete);

export default customerRouter;

/**
 * @openapi
 * components:
 *   schemas:
 *     TCustomer:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *         last_name:
 *           type: string
 *         address:
 *           type: string
 *         id_number:
 *           type: string
 *         email:
 *           type: string
 *         phone:
 *           type: number
 *       required:
 *         - name
 *         - last_name
 *         - address
 *         - id_number
 *         - email
 *         - phone
 *     TCustomerEndpoint:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *         name:
 *           type: string
 *         last_name:
 *           type: string
 *         address:
 *           type: string
 *         id_number:
 *           type: string
 *         email:
 *           type: string
 *         phone:
 *           type: number
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *       required:
 *         - id
 *         - name
 *         - last_name
 *         - address
 *         - id_number
 *         - email
 *         - phone
 *         - createdAt
 *         - updatedAt
 */

