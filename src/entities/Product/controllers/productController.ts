import type { IProductController } from "../domain/interfaces/IProductController.js";
import { ProductRepository } from "../repository/productRepository.js";
import type { Request, Response } from "express";
import { ProductUseCasesController} from "./productUseCasesController.js";

export class ProductController implements IProductController {
  private static instance: ProductController;

  public static getInstance(): ProductController {
    if (!ProductController.instance) {
      ProductController.instance = new ProductController();
    }
    return ProductController.instance;
  }

  private readonly useCases = new ProductUseCasesController(
    ProductRepository.getInstance()
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
