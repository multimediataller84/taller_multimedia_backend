import express from "express";
import { RoleController } from "../controllers/roleController.js";
//mismo auth de User
import { authMiddleware } from "../../User/middlewares/auth.js";

const roleController = RoleController.getInstance();
const rolesRouter = express.Router();

rolesRouter.get("/all", authMiddleware, roleController.getAll);
rolesRouter.get("/:id", roleController.get);
rolesRouter.post("/", roleController.post);
rolesRouter.patch("/:id", roleController.patch);
rolesRouter.delete("/:id", roleController.delete);

export default rolesRouter;
