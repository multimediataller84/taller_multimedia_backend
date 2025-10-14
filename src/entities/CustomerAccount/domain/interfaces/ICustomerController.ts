import type { Request, Response } from "express";

export interface ICustomerController {
  get: (req: Request, res: Response) => Promise<void>;
  getAll: (req: Request, res: Response) => Promise<void>;
  getAllProvince: (req: Request, res: Response) => Promise<void>;
  getAllCanton: (req: Request, res: Response) => Promise<void>;
  getAllDistrict: (req: Request, res: Response) => Promise<void>;
  post: (req: Request, res: Response) => Promise<void>;
  patch: (req: Request, res: Response) => Promise<void>;
  delete: (req: Request, res: Response) => Promise<void>;
}
