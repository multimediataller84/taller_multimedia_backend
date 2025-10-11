import express from "express";
import { CashRegisterController } from "../controllers/cashRegisterController.js";

const cashRegisterController = CashRegisterController.getInstance();
const cashRegisterRouter = express.Router();

cashRegisterRouter.get("/open/all", cashRegisterController.getOpen);
cashRegisterRouter.get("/all", cashRegisterController.getAll);
cashRegisterRouter.get("/:id", cashRegisterController.get);
cashRegisterRouter.post("/", cashRegisterController.post);
cashRegisterRouter.patch("/:id", cashRegisterController.patch);
cashRegisterRouter.delete("/:id", cashRegisterController.delete);
cashRegisterRouter.patch("/open/:id", cashRegisterController.open);
cashRegisterRouter.patch("/close/:id", cashRegisterController.close);

export default cashRegisterRouter;
