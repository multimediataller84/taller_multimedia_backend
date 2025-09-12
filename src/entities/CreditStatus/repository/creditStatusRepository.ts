import type { ICreditStatusRepository } from "../domain/interfaces/ICreditStatusRepository.js";
import type { TCreditStatus } from "../domain/types/TCreditStatus.js";
import type { TCreditStatusEndpoint } from "../domain/types/TCreditStatusEndpoint.js";
import { CreditStatusService } from "../services/creditStatusService.js";

export class CreditStatusRepository implements ICreditStatusRepository {
  private static instance: CreditStatusRepository;
  private readonly service = CreditStatusService.getInstance();

  public static getInstance(): CreditStatusRepository {
    if (!CreditStatusRepository.instance) {
      CreditStatusRepository.instance = new CreditStatusRepository();
    }
    return CreditStatusRepository.instance;
  }

  get = async (id: number): Promise<TCreditStatusEndpoint> => {
    try {
      const status = await this.service.get(id);
      if (!status) {
        throw new Error("credit status not found");
      }
      return status;
    } catch (error) {
      throw error;
    }
  };

  getAll = async (): Promise<TCreditStatusEndpoint[]> => {
    try {
      const statuses = await this.service.getAll();
      if (!statuses) {
        throw new Error("credit statuses not found");
      }
      return statuses;
    } catch (error) {
      throw error;
    }
  };

  post = async (data: TCreditStatus): Promise<TCreditStatusEndpoint> => {
    try {
      const created = await this.service.post(data);
      if (!created) {
        throw new Error("error creating credit status");
      }
      return created;
    } catch (error) {
      throw error;
    }
  };

  patch = async (id: number, data: TCreditStatus): Promise<TCreditStatusEndpoint> => {
    try {
      const updated = await this.service.patch(id, data);
      if (!updated) {
        throw new Error("error updating credit status");
      }
      return updated;
    } catch (error) {
      throw error;
    }
  };

  delete = async (id: number): Promise<TCreditStatusEndpoint> => {
    try {
      const removed = await this.service.delete(id);
      if (!removed) {
        throw new Error("error deleting credit status");
      }
      return removed;
    } catch (error) {
      throw error;
    }
  };
}
