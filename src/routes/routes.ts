import express from "express";
import usersRouter from "../entities/User/routes/userRoutes.js";
import authRouter from "../entities/User/routes/authRoutes.js";
import customerRouter from "../entities/CustomerAccount/routes/customerRoutes.js";

const router = express.Router();

router.use("/user", usersRouter);
router.use("/auth", authRouter);
router.use("/customer", customerRouter);

export default router;
