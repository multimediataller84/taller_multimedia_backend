import type { IProcessDataRepository } from "../domain/interfaces/IProcessDataRepository.js";
import type { TStatus } from "../domain/types/TStatus.js";
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
        throw new Error("error at updating all tax sources");
      }
    } catch (error) {
      throw error
    }
  };

 processExel = async (file: Express.Multer.File): Promise<TStatus> => {
    try {
      const response = await this.processDataService.processExel(file);
      if (!response) {
        throw new Error("error at sending exel to microservice");
      }
      return response
    } catch (error) {
      throw error
    }
  };
}
