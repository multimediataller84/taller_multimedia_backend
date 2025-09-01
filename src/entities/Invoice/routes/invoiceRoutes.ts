import express from "express";
import { InvoiceController } from "../controllers/invoiceController.js";

const invoiceController = InvoiceController.getInstance();
const invoiceRouter = express.Router();

invoiceRouter.get("/all", invoiceController.getAll);
invoiceRouter.get("/:id", invoiceController.get);
invoiceRouter.post("/", invoiceController.post);
invoiceRouter.patch("/:id", invoiceController.patch);
invoiceRouter.delete("/:id", invoiceController.delete);

export default invoiceRouter;
