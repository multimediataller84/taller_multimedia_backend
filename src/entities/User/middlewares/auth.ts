import { type Request, type Response, type NextFunction } from "express";
import jwt from "jsonwebtoken";
import  config  from "../../../utilities/config.js";

export const authMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Token missing" });
  }

  const token = authHeader.split(" ")[1];
  if (!token) {
    return next(new Error("Token missing"));
  }

  try {
    const decoded = jwt.verify(token, config.JWT_ACCESS_SECRET);
    (req as any).user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ error: "Invalid or expired token" });
  }
};
