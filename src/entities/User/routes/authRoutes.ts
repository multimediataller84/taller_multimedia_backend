import express from "express";
import { UserController } from "../controllers/userController.js";

const userController = UserController.getInstance();
const authRouter = express.Router();

authRouter.post("/login", userController.login);
authRouter.post("/register", userController.post);

export default authRouter;
