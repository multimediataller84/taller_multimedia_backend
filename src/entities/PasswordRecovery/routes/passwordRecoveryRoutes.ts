import express from "express";
import { passwordRecoveryController } from "../controllers/passwordRecoveryController.js";

const router = express.Router();

//POST /api/v1/auth/recovery/request-password-reset
router.post("/request-password-reset", passwordRecoveryController.requestPasswordReset);

//POST /api/v1/auth/recovery/reset-password
router.post("/reset-password", passwordRecoveryController.resetPassword);

export default router;
