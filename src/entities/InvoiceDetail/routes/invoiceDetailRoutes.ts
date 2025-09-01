import express from "express";
import { InvoiceDetailController } from "../controllers/invoiceDetailController.js";

const invoiceDetailController = InvoiceDetailController.getInstance();
const invoiceDetailRouter = express.Router();

invoiceDetailRouter.get("/all", invoiceDetailController.getAll);
invoiceDetailRouter.get("/:id", invoiceDetailController.get);
invoiceDetailRouter.post("/", invoiceDetailController.post);
invoiceDetailRouter.patch("/:id", invoiceDetailController.patch);
invoiceDetailRouter.delete("/:id", invoiceDetailController.delete);

export default invoiceDetailRouter;
