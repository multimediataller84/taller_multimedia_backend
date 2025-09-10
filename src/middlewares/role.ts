import { type Request, type Response, type NextFunction } from "express";

export const verifyRole = (role: string) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const user = (req as any).user;
    if (!user) {
      return res.status(401).json({ error: "User not authenticated" });
    }

    if (user.role !== role) {
      return res.status(403).json({ error: "Forbidden: insufficient role" });
    }

    next();
  };
};
