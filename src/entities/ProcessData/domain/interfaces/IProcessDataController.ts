import type { Request, Response } from "express";

export interface IProcessDataController {
  updateAll: (req: Request, res: Response) => Promise<void>;
}
