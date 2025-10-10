import type { ICashRegisterController } from "../domain/interfaces/ICashRegisterController.js";
import { CashRegisterRepository } from "../repository/cashRegisterRepository.js";
import type { Request, Response } from "express";
import { CashRegisterUseCasesController } from "./cashRegisterUseCasesController.js";

export class CashRegisterController implements ICashRegisterController {
  private static instance: CashRegisterController;

  public static getInstance(): CashRegisterController {
    if (!CashRegisterController.instance) {
      CashRegisterController.instance = new CashRegisterController();
    }
    return CashRegisterController.instance;
  }

  private readonly useCases = new CashRegisterUseCasesController(
    CashRegisterRepository.getInstance()
  );

  get = async (req: Request, res: Response): Promise<void> => {
    try {
      const result = await this.useCases.get.execute(Number(req.params.id));
      res.status(200).json(result);
    } catch (error: any) {
      res.status(404).json({ error: error.message });
    }
  };

  getAll = async (req: Request, res: Response): Promise<void> => {
    try {
      const result = await this.useCases.getAll.execute();
      res.status(200).json(result);
    } catch (error: any) {
      res.status(404).json({ error: error.message });
    }
  };

  open = async (req: Request, res: Response): Promise<void> => {
    try {
      const result = await this.useCases.open.execute(
        Number(req.params.id),
        req.body
      );
      res.status(200).json(result);
    } catch (error: any) {
      res.status(404).json({ error: error.message });
    }
  };

  close = async (req: Request, res: Response): Promise<void> => {
    try {
      const result = await this.useCases.close.execute(
        Number(req.params.id),
        req.body
      );
      res.status(200).json(result);
    } catch (error: any) {
      res.status(404).json({ error: error.message });
    }
  };

  post = async (req: Request, res: Response): Promise<void> => {
    try {
      const result = await this.useCases.post.execute(req.body);
      res.status(200).json(result);
    } catch (error: any) {
      res.status(403).json({ error: error.message });
    }
  };

  patch = async (req: Request, res: Response): Promise<void> => {
    try {
      const result = await this.useCases.patch.execute(
        Number(req.params.id),
        req.body
      );
      res.status(200).json(result);
    } catch (error: any) {
      res.status(404).json({ error: error.message });
    }
  };

  delete = async (req: Request, res: Response): Promise<void> => {
    try {
      const result = await this.useCases.delete.execute(Number(req.params.id));
      res.status(200).json(result);
    } catch (error: any) {
      res.status(404).json({ error: error.message });
    }
  };
}
