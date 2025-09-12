import type { Request, Response } from "express";

export interface IProcessDataController {
  updateAll: (req: Request, res: Response) => Promise<void>;
  processExel: (req: Request, res: Response) => Promise<void>;
}
