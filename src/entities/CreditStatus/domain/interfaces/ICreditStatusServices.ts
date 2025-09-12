import type { TCreditStatus } from "../types/TCreditStatus.js";
import type { TCreditStatusEndpoint } from "../types/TCreditStatusEndpoint.js";

export interface ICreditStatusServices {
  get(id: number): Promise<TCreditStatusEndpoint>;
  getAll(): Promise<TCreditStatusEndpoint[]>;
  post(data: TCreditStatus): Promise<TCreditStatusEndpoint>;
  patch(id: number, data: TCreditStatus): Promise<TCreditStatusEndpoint>;
  delete(id: number): Promise<TCreditStatusEndpoint>;
}