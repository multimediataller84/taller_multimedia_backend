import type { ICreditPaymentController } from "../domain/interfaces/ICreditPaymentController.js";
import { CreditPaymentRepository } from "../repository/creditPaymentRepository.js";
import type { Request, Response } from "express";
import { CreditPaymentUseCasesController } from "./creditPaymentUseCasesController.js";

export class CreditPaymentController implements ICreditPaymentController {
  private static instance: CreditPaymentController;

  public static getInstance(): CreditPaymentController {
    if (!CreditPaymentController.instance) {
      CreditPaymentController.instance = new CreditPaymentController();
    }
    return CreditPaymentController.instance;
  }

  private readonly useCases = new CreditPaymentUseCasesController(
    CreditPaymentRepository.getInstance()
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

  getAllByUser = async (req: Request, res: Response): Promise<void> => {
    try {
      const result = await this.useCases.getAllByUser.execute(Number(req.params.id));
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
