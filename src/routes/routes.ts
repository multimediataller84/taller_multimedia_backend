import express from "express";
import usersRouter from "../entities/User/routes/userRoutes.js";
import authRouter from "../entities/User/routes/authRoutes.js";

const router = express.Router();

router.use("/users", usersRouter);
router.use("/auth", authRouter);

export default router;
