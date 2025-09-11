import type { GetAllOptions } from "../../../domain/types/TGetAllOptions.js";
import type { ITaxRepository } from "../domain/interfaces/ITaxRepository.js";
import type { TGetAllEnpoint } from "../domain/types/TGetAllEndpoint.js";
import type { TTax } from "../domain/types/TTax.js";
import type { TTaxEndpoint } from "../domain/types/TTaxEndpoint.js";
import { TaxService } from "../services/taxService.js";

export class TaxRepository implements ITaxRepository {
  private static instance: TaxRepository;
  private readonly taxService = TaxService.getInstance();

  public static getInstance(): TaxRepository {
    if (!TaxRepository.instance) {
      TaxRepository.instance = new TaxRepository();
    }
    return TaxRepository.instance;
  }

  get = async (id: number): Promise<TTaxEndpoint> => {
    try {
      const role = await this.taxService.get(id);
      if (!role) {
        throw new Error("source not found");
      }
      return role;
    } catch (error) {
      throw error;
    }
  };

  getAll = async (options: GetAllOptions): Promise<TGetAllEnpoint> => {
    try {
      const roles = await this.taxService.getAll(options);
      if (!roles) {
        throw new Error("sources not found");
      }
      return roles;
    } catch (error) {
      throw error;
    }
  };

  post = async (data: TTax): Promise<TTaxEndpoint> => {
    try {
      const role = await this.taxService.post(data);
      if (!role) {
        throw new Error("error creating source");
      }
      return role;
    } catch (error) {
      throw error;
    }
  };

  patch = async (id: number, data: TTax): Promise<TTaxEndpoint> => {
    try {
      const role = await this.taxService.patch(id, data);
      if (!role) {
        throw new Error("error updating source");
      }
      return role;
    } catch (error) {
      throw error;
    }
  };

  delete = async (id: number): Promise<TTaxEndpoint> => {
    try {
      const role = await this.taxService.delete(id);
      if (!role) {
        throw new Error("error deleting source");
      }
      return role;
    } catch (error) {
      throw error;
    }
  };
}
