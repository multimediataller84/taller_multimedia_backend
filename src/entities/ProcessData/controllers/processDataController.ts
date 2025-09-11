import type { IProcessDataController } from "../domain/interfaces/IProcessDataController.js";
import { ProcessDataRepository } from "../repository/processDataRepository.js";
import type { Request, Response } from "express";
import { ProcessDataUseCasesController } from "./processDataUseCasesController.js";

export class ProcessDataController implements IProcessDataController {
  private static instance: ProcessDataController;

  public static getInstance(): ProcessDataController {
    if (!ProcessDataController.instance) {
      ProcessDataController.instance = new ProcessDataController();
    }
    return ProcessDataController.instance;
  }

  private readonly useCases = new ProcessDataUseCasesController(
    ProcessDataRepository.getInstance()
  );

  updateAll = async (req: Request, res: Response): Promise<void> => {
    try {
      if (!req.file) throw "file dont exist";
      const result = await this.useCases.updateAll.execute(req.file);
      res.status(200).json(result);
    } catch (error: any) {
      res.status(404).json({ error: error.message });
    }
  };
}
