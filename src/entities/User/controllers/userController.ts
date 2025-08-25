import type { IUserController } from "../domain/interfaces/IUserController.js";
import { UserRepository } from "../repository/userRepository.js";
import type { Request, Response } from "express";
import { UserUseCasesController } from "./userUseCasesController.js";

export class UserController implements IUserController {
  private static instance: UserController;

  public static getInstance(): UserController {
    if (!UserController.instance) {
      UserController.instance = new UserController();
    }
    return UserController.instance;
  }

  private readonly useCases = new UserUseCasesController(
    UserRepository.getInstance()
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
      res.status(404).json({ error: error.message });
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

  login = async (req: Request, res: Response): Promise<void> => {
    try {
      const result = await this.useCases.login.execute(req.body);
      res.status(200).json(result);
    } catch (error: any) {
      res.status(404).json({ error: error.message });
    }
  };
}
