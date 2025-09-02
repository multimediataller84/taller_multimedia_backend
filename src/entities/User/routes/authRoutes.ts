import express from "express";
import { UserController } from "../controllers/userController.js";

const userController = UserController.getInstance();
const authRouter = express.Router();

/**
 * @openapi
 * tags:
 *   - name: Auth
 *     description: Authentication endpoints
 */

/**
 * @openapi
 * /auth/login:
 *   post:
 *     summary: User login
 *     tags:
 *       - Auth
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *             required:
 *               - email
 *               - password
 *     responses:
 *       200:
 *         description: Login sussesfull
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/TUserEndpoint'
 *       404:
 *         description: Invalid credentials
 */
authRouter.post("/login", userController.login);

/**
 * @openapi
 * /auth/register:
 *   post:
 *     summary: Registering a new user
 *     tags:
 *       - Auth
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/TUser'
 *     responses:
 *       200:
 *         description: Successfully created user
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/TUserEndpoint'
 *       404:
 *         description: Registration error
 */
authRouter.post("/register", userController.post);

export default authRouter;

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