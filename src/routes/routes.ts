import express from "express";
import { authMiddleware } from "../middlewares/auth.js";
import usersRouter from "../entities/User/routes/userRoutes.js";
import authRouter from "../entities/User/routes/authRoutes.js";
import customerRouter from "../entities/CustomerAccount/routes/customerRoutes.js";
import invoiceRouter from "../entities/Invoice/routes/invoiceRoutes.js";
import invoiceDetailRouter from "../entities/InvoiceDetail/routes/invoiceDetailRoutes.js";
import productRouter from "../entities/Product/routes/productRoutes.js";
import rolesRouter from "../entities/Role/routes/roleRoutes.js";
import swaggerSpec from "../lib/swagger.js";
import categoryRouter from "../entities/Category/routes/categoryRoutes.js";

const router = express.Router();

router.get("/openapi.json", (req, res) => {
  res.setHeader("Content-Type", "application/json");
  res.send(swaggerSpec);
});

router.use("/auth", authRouter);
router.use("/user", authMiddleware, usersRouter);
router.use("/customer", authMiddleware, customerRouter);
router.use("/invoice", authMiddleware, invoiceRouter);
router.use("/invoice/detail", authMiddleware, invoiceDetailRouter);
router.use("/product", authMiddleware, productRouter);
router.use("/category", authMiddleware, categoryRouter);
router.use("/role", authMiddleware, rolesRouter);


export default router;
