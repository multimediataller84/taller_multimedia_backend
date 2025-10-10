import type { ICashRegisterRepository } from "../domain/interfaces/ICashRegisterRepository.js";
import type { TCashRegister } from "../domain/types/TCashRegister.js";
import type { TCloseRegister } from "../domain/types/TCloseRegister.js";
import type { TOpenRegister } from "../domain/types/TOpenRegister.js";
import { CashRegisterService } from "../services/CashRegisterService.js";

export class CashRegisterRepository implements ICashRegisterRepository {
  public static instance: CashRegisterRepository;
  private readonly cashRegisterService = CashRegisterService.getInstance();

  static getInstance(): CashRegisterRepository {
    if (!CashRegisterRepository.instance) {
      CashRegisterRepository.instance = new CashRegisterRepository();
    }
    return CashRegisterRepository.instance;
  }

  get = async (id: number): Promise<TCashRegister> => {
    try {
      const cashRegister = await this.cashRegisterService.get(id);
      if (!cashRegister) {
        throw new Error("source not found");
      }
      return cashRegister;
    } catch (error) {
      throw error;
    }
  };

  getAll = async (): Promise<TCashRegister[]> => {
    try {
      const cashRegister = await this.cashRegisterService.getAll();
      if (cashRegister.length === 0) {
        throw new Error("sources not found");
      }
      return cashRegister;
    } catch (error) {
      throw error;
    }
  };

  post = async (data: TCashRegister): Promise<TCashRegister> => {
    try {
      const cashRegister = await this.cashRegisterService.post(data);
      if (!cashRegister) {
        throw new Error("error at create Cash register");
      }
      return cashRegister;
    } catch (error) {
      throw error;
    }
  };

  open = async (id: number, data: TOpenRegister): Promise<TCashRegister> => {
    try {
      const cashRegister = await this.cashRegisterService.open(id, data);
      if (!cashRegister) {
        throw new Error("error at create open register");
      }
      return cashRegister;
    } catch (error) {
      throw error;
    }
  };

  close = async (id: number, data: TCloseRegister): Promise<TCashRegister> => {
    try {
      const cashRegister = await this.cashRegisterService.close(id, data);
      if (!cashRegister) {
        throw new Error("error at create Cash register");
      }
      return cashRegister;
    } catch (error) {
      throw error;
    }
  };

  patch = async (id: number, data: TCashRegister): Promise<TCashRegister> => {
    try {
      const cashRegister = await this.cashRegisterService.patch(id, data);
      if (!cashRegister) {
        throw new Error("error at update source");
      }
      return cashRegister;
    } catch (error) {
      throw error;
    }
  };

  delete = async (id: number): Promise<TCashRegister> => {
    try {
      const cashRegister = await this.cashRegisterService.delete(id);
      if (!cashRegister) {
        throw new Error("error at delete source");
      }
      return cashRegister;
    } catch (error) {
      throw error;
    }
  };
}
