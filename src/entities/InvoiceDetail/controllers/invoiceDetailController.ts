import type { IInvoiceDetailController } from "../domain/interfaces/IInvoiceDetailController.js";
import { InvoiceDetailRepository } from "../repository/invoiceDetailRepository.js";
import type { Request, Response } from "express";
import { InvoiceDetailUseCasesController } from "./invoiceDetailUseCasesController.js";

export class InvoiceDetailController implements IInvoiceDetailController {
  private static instance: InvoiceDetailController;

  public static getInstance(): InvoiceDetailController {
    if (!InvoiceDetailController.instance) {
      InvoiceDetailController.instance = new InvoiceDetailController();
    }
    return InvoiceDetailController.instance;
  }

  private readonly useCases = new InvoiceDetailUseCasesController(
    InvoiceDetailRepository.getInstance()
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
