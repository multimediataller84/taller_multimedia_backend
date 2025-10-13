import type { TCashRegister } from "../types/TCashRegister.js";
import type { TCloseRegister } from "../types/TCloseRegister.js";
import type { TOpenRegister } from "../types/TOpenRegister.js";

export interface ICashRegisterService {
  get: (id: number) => Promise<TCashRegister>;
  getAll: () => Promise<TCashRegister[]>;
  post: (data: TCashRegister) => Promise<TCashRegister>;
  patch: (id: number, data: TCashRegister) => Promise<TCashRegister>;
  delete: (id: number) => Promise<TCashRegister>;
  open: (id: number, data: TOpenRegister) => Promise<TCashRegister> 
  close: (id:number, data: TCloseRegister) => Promise<TCashRegister>;
  getOpen: () => Promise<TCashRegister[]>;
}
