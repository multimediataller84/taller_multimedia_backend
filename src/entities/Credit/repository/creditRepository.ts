import type { ICreditRepository } from "../domain/interfaces/ICreditRepository.js";
import type { TCredit } from "../domain/types/TCredit.js";
import type { TCreditEndpoint } from "../domain/types/TCreditEndpoint.js";
import { CreditService } from "../services/creditService.js";

export class CreditRepository implements ICreditRepository {
  private static instance: CreditRepository;
  private readonly creditService = CreditService.getInstance();

  public static getInstance(): CreditRepository {
    if (!CreditRepository.instance) {
      CreditRepository.instance = new CreditRepository();
    }
    return CreditRepository.instance;
  }

  get = async (id: number): Promise<TCreditEndpoint> => {
    try {
      const invoice = await this.creditService.get(id);
      if (!invoice) {
        throw new Error("source not found");
      }
      return invoice;
    } catch (error) {
      throw error;
    }
  };

  getAll = async (): Promise<TCreditEndpoint[]> => {
    try {
      const invoice = await this.creditService.getAll();
      if (invoice.length === 0) {
        throw new Error("sources not found");
      }
      return invoice;
    } catch (error) {
      throw error;
    }
  };

  post = async (data: TCredit): Promise<TCreditEndpoint> => {
    try {
      const invoice = await this.creditService.post(data);
      if (!invoice) {
        throw new Error("error at create customer");
      }
      return invoice;
    } catch (error) {
      throw error;
    }
  };

  patch = async (id: number, data: TCredit): Promise<TCreditEndpoint> => {
    try {
      const invoice = await this.creditService.patch(id, data);
      if (!invoice) {
        throw new Error("error at update source");
      }
      return invoice;
    } catch (error) {
      throw error;
    }
  };

  delete = async (id: number): Promise<TCreditEndpoint> => {
    try {
      const invoice = await this.creditService.delete(id);
      if (!invoice) {
        throw new Error("error at delete source");
      }
      return invoice;
    } catch (error) {
      throw error;
    }
  };
}
