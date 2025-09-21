import { type Request, type Response, type NextFunction } from "express";
import jwt from "jsonwebtoken";

export const verifyRole = (role: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ error: "Token missing" });
    }

    const token = authHeader.split(" ")[1];
    if (!token) {
      return next(new Error("Token missing"));
    }

    const user = jwt.decode(token);
    if (!user || typeof user !== "object") {
      return res.status(401).json({ error: "Invalid token" });
    }

    if (!user) {
      return res.status(401).json({ error: "User not authenticated" });
    }

    if (!role.includes(user.role)) {
      return res.status(403).json({ error: "Forbidden: insufficient role" });
    }

    next();
  };
};
