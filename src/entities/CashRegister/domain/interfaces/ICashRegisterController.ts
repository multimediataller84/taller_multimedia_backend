import type { Request, Response } from "express";

export interface ICashRegisterController {
  get: (req: Request, res: Response) => Promise<void>;
  getAll: (req: Request, res: Response) => Promise<void>;
  post: (req: Request, res: Response) => Promise<void>;
  patch: (req: Request, res: Response) => Promise<void>;
  delete: (req: Request, res: Response) => Promise<void>;
  open: (req: Request, res: Response) => Promise<void>;
  close: (req: Request, res: Response) => Promise<void>;
  getOpen: (req: Request, res: Response) => Promise<void>;
}
