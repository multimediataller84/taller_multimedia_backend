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
import creditRouter from "../entities/Credit/routes/creditRoutes.js";
import creditPaymentRouter from "../entities/CreditPayment/routes/creditPaymentRoutes.js";
import taxRouter from "../entities/Tax/routes/taxRoutes.js";
import { verifyRole } from "../middlewares/role.js";
import processDataRouter from "../entities/ProcessData/routes/processDataRouter.js";
import creditStatusRouter from "../entities/CreditStatus/routes/creditStatusRoutes.js";
import paymentMethodRouter from "../entities/PaymentMethod/routes/paymentMethodRoutes.js";

const router = express.Router();

router.get("/openapi.json", (req, res) => {
  res.setHeader("Content-Type", "application/json");
  res.send(swaggerSpec);
});

router.use("/auth", authRouter);
router.use("/user", usersRouter);
router.use("/customer", authMiddleware, verifyRole("employee"), customerRouter);
router.use("/invoice", authMiddleware, verifyRole("employee"), invoiceRouter);
router.use("/invoice/detail", authMiddleware, verifyRole("employee"), invoiceDetailRouter);
router.use("/product", productRouter);
router.use("/product/tax", authMiddleware, verifyRole("employee"), taxRouter);
router.use("/category", authMiddleware, verifyRole("employee"), categoryRouter);
router.use("/role", rolesRouter);
router.use("/credit", authMiddleware, verifyRole("employee"), creditRouter);
router.use("/credit/payment", authMiddleware, verifyRole("employee"), creditPaymentRouter);
router.use("/admin/data", processDataRouter);
router.use("/credit/status", authMiddleware, verifyRole("employee"), creditStatusRouter);
router.use("/payment/method", authMiddleware, verifyRole("employee"), paymentMethodRouter);

export default router;
