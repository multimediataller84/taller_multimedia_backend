import express from "express";
import { RoleController } from "../controllers/roleController.js";

const roleController = RoleController.getInstance();
const rolesRouter = express.Router();

/**
 * @openapi
 * tags:
 *   - name: Role
 *     description: Endpoints to manage roles
 */

/**
 * @openapi
 * /roles/all:
 *   get:
 *     summary: Gets all roles
 *     tags:
 *       - Role
 *     responses:
 *       200:
 *         description: List of roles
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/TRoleEndpoint'
 *       404:
 *         description: No roles found
 */
rolesRouter.get("/all", roleController.getAll);

/**
 * @openapi
 * /roles/{id}:
 *   get:
 *     summary: Get a role by ID
 *     tags:
 *       - Role
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID del rol
 *     responses:
 *       200:
 *         description: Rol found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/TRoleEndpoint'
 *       404:
 *         description: Rol not found
 */
rolesRouter.get("/:id", roleController.get);

/**
 * @openapi
 * /roles:
 *   post:
 *     summary: Create a new role
 *     tags:
 *       - Role
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/TRole'
 *     responses:
 *       200:
 *         description: Successfully created role
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/TRoleEndpoint'
 *       404:
 *         description: Error creating role
 */
rolesRouter.post("/", roleController.post);

/**
 * @openapi
 * /roles/{id}:
 *   patch:
 *     summary: Update a role by ID
 *     tags:
 *       - Role
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID del rol
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/TRole'
 *     responses:
 *       200:
 *         description: Role updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/TRoleEndpoint'
 *       404:
 *         description: Error updating role
 */
rolesRouter.patch("/:id", roleController.patch);

/**
 * @openapi
 * /roles/{id}:
 *   delete:
 *     summary: Delete a role by ID
 *     tags:
 *       - Role
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID del rol
 *     responses:
 *       200:
 *         description: Successfully deleted role
 *       404:
 *         description: Error deleting role
 */
rolesRouter.delete("/:id", roleController.delete);

export default rolesRouter;

/**
 * @openapi
 * components:
 *   schemas:
 *     TRole:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *         description:
 *           type: string
 *           nullable: true
 *       required:
 *         - name
 *     TRoleEndpoint:
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
