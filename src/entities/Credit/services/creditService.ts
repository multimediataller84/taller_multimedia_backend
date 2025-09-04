import Credit from "../domain/models/CreditModel.js";
import type { ICreditServices } from "../domain/interfaces/ICreditServices.js";
import type { TCreditEndpoint } from "../domain/types/TCreditEndpoint.js";
import type { TCredit } from "../domain/types/TCredit.js";

export class CreditService implements ICreditServices {
  private static instance: CreditService;

  public static getInstance(): CreditService {
    if (!CreditService.instance) {
      CreditService.instance = new CreditService();
    }
    return CreditService.instance;
  }

  get = async (id: number): Promise<TCreditEndpoint> => {
    try {
      const credit = await Credit.findByPk(id);
      if (!credit) {
        throw new Error("credit not found");
      }
      return credit;
    } catch (error) {
      throw error;
    }
  };

  getAll = async (): Promise<TCreditEndpoint[]> => {
    try {
      const credit = await Credit.findAll();
      if (credit.length === 0) {
        throw new Error("credit not found");
      }
      return credit;
    } catch (error) {
      throw error;
    }
  };

  post = async (data: TCredit): Promise<TCreditEndpoint> => {
    try {
      const { invoice_id } = data;
      const exists = await Credit.findOne({ where: { invoice_id } });
      if (exists) throw new Error("credit of this invoice already exists");

      const credit = await Credit.create(data);
      return credit;
    } catch (error) {
      throw error;
    }
  };

  patch = async (id: number, data: TCredit): Promise<TCreditEndpoint> => {
    try {
      const credit = await Credit.findByPk(id);
      if (!credit) {
        throw new Error("credit not found");
      }
      await credit.update(data);
      return credit;
    } catch (error) {
      throw error;
    }
  };

  delete = async (id: number): Promise<TCreditEndpoint> => {
    try {
      const credit = await Credit.findByPk(id);
      if (!credit) {
        throw new Error("credit not found");
      }
      await credit.destroy();
      return credit;
    } catch (error) {
      throw error;
    }
  };
}
