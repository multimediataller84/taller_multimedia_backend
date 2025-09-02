import type { ITaxServices } from "../domain/interfaces/ITaxServices.js";
import Tax from "../domain/models/TaxModel.js";
import type { TTax } from "../domain/types/TTax.js";
import type { TTaxEndpoint } from "../domain/types/TTaxEndpoint.js";

export class TaxService implements ITaxServices{
  private static instance: TaxService;

  public static getInstance(): TaxService {
    if (!TaxService.instance) {
      TaxService.instance = new TaxService();
    }
    return TaxService.instance;
  }

  get = async (id: number): Promise<TTaxEndpoint> => {
    try {
      const tax = await Tax.findByPk(id);
      if (!tax) {
        throw new Error("Tax not found");
      }
      return tax;
    } catch (error) {
      throw error;
    }
  };

  getAll = async (): Promise<TTaxEndpoint[]> => {
    try {
      const tax = await Tax.findAll();
      if (tax.length === 0) {
        throw new Error("Tax not found");
      }
      return tax;
    } catch (error) {
      throw error;
    }
  };

  post = async (data: TTax): Promise<TTaxEndpoint> => {
    try {
      const { name } = data;

      const exists = await Tax.findOne({ where: { name } });
      if (exists) throw new Error("name already exists");

      const tax = await Tax.create(data);
      
      return tax;
    } catch (error) {
      throw error;
    }
  };

  patch = async (id: number, data: TTax): Promise<TTaxEndpoint> => {
    try {
      const tax = await Tax.findByPk(id);
      if (!tax) throw new Error("Tax not found");

      await tax.update(data);
      return tax;
    } catch (error) {
      throw error;
    }
  };

  delete = async (id: number): Promise<TTaxEndpoint> => {
    try {
      const tax = await Tax.findByPk(id);
      if (!tax) throw new Error("Tax not found");

      await tax.destroy();
      return tax; 
    } catch (error) {
      throw error;
    }
  };
}
