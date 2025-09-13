import type { TGetAllOptions } from "../../../domain/types/TGetAllOptions.js";
import type { ITaxServices } from "../domain/interfaces/ITaxServices.js";
import Tax from "../domain/models/TaxModel.js";
import type { TGetAllEnpoint } from "../domain/types/TGetAllEndpoint.js";
import type { TTax } from "../domain/types/TTax.js";
import type { TTaxEndpoint } from "../domain/types/TTaxEndpoint.js";
import { Op } from "sequelize";

export class TaxService implements ITaxServices {
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

  getAll = async (options: TGetAllOptions): Promise<TGetAllEnpoint> => {
    try {
      const {
        description,
        limit = 50,
        offset = 0,
        orderBy = "name",
        orderDirection = "ASC",
      } = options;

      const whereClause = description
        ? { description: { [Op.iLike]: `%${description}%` } }
        : {};

      const total = await Tax.count({ where: whereClause });

      const data = await Tax.findAll({
        where: whereClause,
        limit,
        offset,
        order: [[orderBy, orderDirection]],
      });

      return { data, total };
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

  patch = async (data: TTax): Promise<TTaxEndpoint> => {
    try {
      const { name } = data;
      const tax = await Tax.findOne({ where: { name } });
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
