import type { IProcessDataRepository } from "../domain/interfaces/IProcessDataRepository.js";
import { ProcessDataService } from "../services/processDataService.js";

export class ProcessDataRepository implements IProcessDataRepository {
  private static instance: ProcessDataRepository;
  private readonly processDataService = ProcessDataService.getInstance();

  public static getInstance(): ProcessDataRepository {
    if (!ProcessDataRepository.instance) {
      ProcessDataRepository.instance = new ProcessDataRepository();
    }
    return ProcessDataRepository.instance;
  }

  updateAll = async (file: Express.Multer.File): Promise<any> => {
    try {
      const role = await this.processDataService.updateAll(file);
      if (!role) {
        throw new Error("error updating all tax sources");
      }
    } catch (error) {
      throw error
    }
  };
}
