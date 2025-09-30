import express from "express";
import { authMiddleware } from "../middlewares/auth.js";
import usersRouter from "../entities/User/routes/userRoutes.js";
import authRouter from "../entities/User/routes/authRoutes.js";
import customerRouter from "../entities/CustomerAccount/routes/customerRoutes.js";
import invoiceRouter from "../entities/Invoice/routes/invoiceRoutes.js";
import productRouter from "../entities/Product/routes/productRoutes.js";
import rolesRouter from "../entities/Role/routes/roleRoutes.js";
import swaggerSpec from "../lib/swagger.js";
import categoryRouter from "../entities/Category/routes/categoryRoutes.js";
import creditRouter from "../entities/Credit/routes/creditRoutes.js";
import creditPaymentRouter from "../entities/CreditPayment/routes/creditPaymentRoutes.js";
import taxRouter from "../entities/Tax/routes/taxRoutes.js";
import { verifyRole } from "../middlewares/role.js";
import processDataRouter from "../entities/ProcessData/routes/processDataRouter.js";

const router = express.Router();

router.get("/openapi.json", (req, res) => {
  res.setHeader("Content-Type", "application/json");
  res.send(swaggerSpec);
});

router.use("/auth", authRouter);
router.use("/user", authMiddleware, verifyRole(["admin", "employee"]), usersRouter);
router.use("/customer", authMiddleware, verifyRole(["admin", "employee"]), customerRouter);
router.use("/invoice", authMiddleware, verifyRole(["admin", "employee"]), invoiceRouter);
router.use("/product", authMiddleware, verifyRole(["admin", "employee"]), productRouter);
router.use("/product/tax", authMiddleware, verifyRole(["admin", "employee"]), taxRouter);
router.use("/category", authMiddleware, verifyRole(["admin", "employee"]), categoryRouter);
router.use("/role", authMiddleware, verifyRole(["admin", "employee"]), rolesRouter);
router.use("/credit", authMiddleware, verifyRole(["admin", "employee"]), creditRouter);
router.use("/credit/payment", authMiddleware, verifyRole(["admin", "employee"]), creditPaymentRouter);
router.use("/admin/data", processDataRouter);

export default router;
