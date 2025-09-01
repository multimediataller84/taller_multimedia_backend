import express from "express";
import { UserController } from "../controllers/userController.js";

const userController = UserController.getInstance();
const usersRouter = express.Router();

/**
 * @openapi
 * tags:
 *   - name: User
 *     description: Endpoints related with users
 */

/**
 * @openapi
 * /user/all:
 *   get:
 *     summary: Return all users
 *     tags:
 *       - User
 *     responses:
 *       200:
 *         description: List of users
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/TUserEndpoint'
 *       404:
 *         description: Users not found
 */
usersRouter.get("/all", userController.getAll);


/**
 * @openapi
 * /user/{id}:
 *   get:
 *     summary: Return user by ID
 *     tags:
 *       - User
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: User ID
 *     responses:
 *       200:
 *         description: User not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/TUserEndpoint'
 *       404:
 *         description: User not found
 */
usersRouter.get("/:id", userController.get);

/**
 * @openapi
 * /user/{id}:
 *   patch:
 *     summary: Update user by ID
 *     tags:
 *       - User
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: User ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/TUser'
 *     responses:
 *       200:
 *         description: User updated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/TUserEndpoint'
 *       404:
 *         description: User not found
 */
usersRouter.patch("/:id", userController.patch);

/**
 * @openapi
 * /user/{id}:
 *   delete:
 *     summary: Delete User by ID
 *     tags:
 *       - User
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: User ID
 *     responses:
 *       200:
 *         description: User deleted
 *       404:
 *         description: User not found
 */
usersRouter.delete("/:id", userController.delete);

export default usersRouter;

/**
 * @openapi
 * components:
 *   schemas:
 *     TUser:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *         last_name:
 *           type: string
 *         username:
 *           type: string
 *         email:
 *           type: string
 *         password:
 *           type: string
 *         role:
 *           type: string
 *       required:
 *         - name
 *         - last_name
 *         - username
 *         - email
 *         - password
 *         - role
 *     TUserEndpoint:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *         name:
 *           type: string
 *         last_name:
 *           type: string
 *         username:
 *           type: string
 *         email:
 *           type: string
 *         last_seen:
 *           type: string
 *           format: date-time
 *           nullable: true
 *         email_verified_at:
 *           type: string
 *           format: date-time
 *           nullable: true
 *         remember_token:
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
 *         - last_name
 *         - username
 *         - email
 *         - createdAt
 *         - updatedAt
 */
