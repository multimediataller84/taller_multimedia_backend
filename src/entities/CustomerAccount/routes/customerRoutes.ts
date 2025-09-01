import express from "express";
import { CustomerController } from "../controllers/customerController.js";

const customerController = CustomerController.getInstance();
const customerRouter = express.Router();

customerRouter.get("/all", customerController.getAll);
customerRouter.get("/:id", customerController.get);
customerRouter.post("/", customerController.post);
customerRouter.patch("/:id", customerController.patch);
customerRouter.delete("/:id", customerController.delete);

export default customerRouter;
