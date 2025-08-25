import express from "express";
import { UserController } from "../controllers/userController.js";
import { authMiddleware } from "../middlewares/auth.js";

const userController = UserController.getInstance();
const usersRouter = express.Router();

usersRouter.get("/all", authMiddleware, userController.getAll);
usersRouter.get("/:id", userController.get);
usersRouter.patch("/:id", userController.patch);
usersRouter.delete("/:id", userController.delete);

export default usersRouter;
