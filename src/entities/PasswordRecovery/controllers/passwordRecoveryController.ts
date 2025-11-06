import type { Request, Response } from "express";
import { passwordRecoveryService } from "../services/passwordRecoveryService.js";

export const passwordRecoveryController = {

  async requestPasswordReset(req: Request, res: Response) {
    try {
      const { email, username } = req.body;

      if (!email?.trim() && !username?.trim()) {
        return res.status(400).json({ error: "Email or username is required" });
      }

      const identifier = email || username;
      const result = await passwordRecoveryService.requestPasswordReset(identifier);

      return res.status(200).json({
        message: result.message,
        ...(process.env.NODE_ENV === "development" && { token: result.token })
      });
    } catch (error: any) {
      return res.status(400).json({ error: error.message });
    }
  },

  async resetPassword(req: Request, res: Response) {
    try {
      const { token, newPassword } = req.body;

      if (!token || !newPassword) {
        return res.status(400).json({ error: "Token and newPassword are required" });
      }

      const result = await passwordRecoveryService.resetPassword(token, newPassword);
      return res.status(200).json(result);
    } catch (error: any) {
      return res.status(400).json({ error: error.message });
    }
  }
};
