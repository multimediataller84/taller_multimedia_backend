import type { ICreditStatusServices } from "../domain/interfaces/ICreditStatusServices.js";
import CreditStatus from "../domain/models/CreditStatusModel.js";
import type { TCreditStatus } from "../domain/types/TCreditStatus.js";
import type { TCreditStatusEndpoint } from "../domain/types/TCreditStatusEndpoint.js";

const ALLOWED_STATUS: ReadonlyArray<string> = [
  "pending",
  "approved",
  "rejected",
  "paid",
  "cancelled",
];

export class CreditStatusService implements ICreditStatusServices {
  private static instance: CreditStatusService;

  public static getInstance(): CreditStatusService {
    if (!CreditStatusService.instance) {
      CreditStatusService.instance = new CreditStatusService();
    }
    return CreditStatusService.instance;
  }

  get = async (id: number): Promise<TCreditStatusEndpoint> => {
    try {
      const status = await CreditStatus.findByPk(id);
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
      const statuses = await CreditStatus.findAll();
      if (statuses.length === 0) {
        throw new Error("credit statuses not found");
      }
      return statuses;
    } catch (error) {
      throw error;
    }
  };

  post = async (data: TCreditStatus): Promise<TCreditStatusEndpoint> => {
    try {
      const { name } = data;
      if (!name) throw new Error("name is required");
      if (!ALLOWED_STATUS.includes(name))
        throw new Error("invalid credit status name");

      const exists = await CreditStatus.findOne({ where: { name } });
      if (exists) throw new Error("name already exists");

      const created = await CreditStatus.create({
        name,
        ...(data.description !== undefined ? { description: data.description } : {}),
      });

      return created;
    } catch (error) {
      throw error;
    }
  };

  patch = async (id: number, data: TCreditStatus): Promise<TCreditStatusEndpoint> => {
    try {
      const status = await CreditStatus.findByPk(id);
      if (!status) throw new Error("credit status not found");

      if (data.name) {
        if (!ALLOWED_STATUS.includes(data.name))
          throw new Error("invalid credit status name");
        if (data.name !== status.name) {
          const exists = await CreditStatus.findOne({ where: { name: data.name } });
          if (exists) throw new Error("name already exists");
        }
      }

      await status.update(data);
      return status;
    } catch (error) {
      throw error;
    }
  };

  delete = async (id: number): Promise<TCreditStatusEndpoint> => {
    try {
      const status = await CreditStatus.findByPk(id);
      if (!status) throw new Error("credit status not found");

      await status.destroy();
      return status;
    } catch (error) {
      throw error;
    }
  };
}
