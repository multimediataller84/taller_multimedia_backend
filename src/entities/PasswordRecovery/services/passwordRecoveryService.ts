import jwt from "jsonwebtoken";
import { config } from "../../../utilities/config.js";
import User from "../../User/domain/models/UserModel.js";
import bcrypt from "bcrypt";

export class PasswordRecoveryService {
    
  async requestPasswordReset(identifier: string) {
    try {
        
      const user = await User.findOne({
        where: { [identifier.includes("@") ? "email" : "username"]: identifier }
        });

      if (!user) {
        throw new Error("User not found");
      }

      const token = jwt.sign(
        { id: user.id, username: user.username },
        config.JWT_ACCESS_SECRET,
        { expiresIn: "10m" }
      );

      user.remember_token = token;
      await user.save();

      return {
        message: "Password reset token generated successfully",
        token //esto es para pruebas internas
      };
    } catch (error) {
      throw error;
    }
  }

  async resetPassword(token: string, newPassword: string) {
    try {
        
      const decoded: any = jwt.verify(token, config.JWT_ACCESS_SECRET);

      const user = await User.findByPk(decoded.id);
      if (!user) {
        throw new Error("User not found");
      }

      if (user.remember_token !== token) {
        throw new Error("Invalid or expired token");
      }

      const hashed = await bcrypt.hash(newPassword, 10);

      user.password = hashed;
      user.remember_token = "";
      await user.save();

      return { message: "Password reset successful" };
    } catch (error: any) {
      if (error.name === "TokenExpiredError") {
        throw new Error("Token expired");
      }
      throw error;
    }
  }
}

export const passwordRecoveryService = new PasswordRecoveryService();
