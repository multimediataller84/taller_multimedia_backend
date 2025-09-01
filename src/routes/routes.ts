import express from "express";
import usersRouter from "../entities/User/routes/userRoutes.js";
import authRouter from "../entities/User/routes/authRoutes.js";
import customerRouter from "../entities/CustomerAccount/routes/customerRoutes.js";
import invoiceRouter from "../entities/Invoice/routes/invoiceRoutes.js";
import invoiceDetailRouter from "../entities/InvoiceDetail/routes/invoiceDetailRoutes.js";

const router = express.Router();

router.use("/user", usersRouter);
router.use("/auth", authRouter);
router.use("/customer", customerRouter);
router.use("/invoice", invoiceRouter);
router.use("/invoice/detail", invoiceDetailRouter);

export default router;
