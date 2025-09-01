import InvoiceDetail from "../domain/models/InvoiceDetailModel.js";
import type { IInvoiceDetailServices } from "../domain/interfaces/IInvoiceDetailServices.js";
import type { TInvoiceDetailEndpoint } from "../domain/types/TInvoiceDetailEndpoint.js";
import type { TInvoiceDetail } from "../domain/types/TInvoiceDetail.js";

export class InvoiceDetailService implements IInvoiceDetailServices {
  private static instance: InvoiceDetailService;

  public static getInstance(): InvoiceDetailService {
    if (!InvoiceDetailService.instance) {
      InvoiceDetailService.instance = new InvoiceDetailService();
    }
    return InvoiceDetailService.instance;
  }

  get = async (id: number): Promise<TInvoiceDetailEndpoint> => {
    try {
      const invoice_detail = await InvoiceDetail.findByPk(id);
      if (!invoice_detail) {
        throw new Error("invoice_detail not found");
      }
      return invoice_detail;
    } catch (error) {
      throw error;
    }
  };

  getAll = async (): Promise<TInvoiceDetailEndpoint[]> => {
    try {
      const invoice_detail = await InvoiceDetail.findAll();
      if (invoice_detail.length === 0) {
        throw new Error("invoice_detail not found");
      }
      return invoice_detail;
    } catch (error) {
      throw error;
    }
  };

  post = async (data: TInvoiceDetail): Promise<TInvoiceDetailEndpoint> => {
    try {
      const { invoice_id, product_id } = data;
      const exists = await InvoiceDetail.findOne({
        where: { invoice_id, product_id },
      });
      if (exists) throw new Error("invoice_detail of product already exists");

      const invoice_detail = await InvoiceDetail.create(data);
      return invoice_detail;
    } catch (error) {
      throw error;
    }
  };

  patch = async (id: number, data: TInvoiceDetail): Promise<TInvoiceDetailEndpoint> => {
    try {
      const invoice_detail = await InvoiceDetail.findByPk(id);
      if (!invoice_detail) {
        throw new Error("invoice_detail not found");
      }
      await invoice_detail.update(data);
      return invoice_detail;
    } catch (error) {
      throw error;
    }
  };

  delete = async (id: number): Promise<TInvoiceDetailEndpoint> => {
    try {
      const invoice_detail = await InvoiceDetail.findByPk(id);
      if (!invoice_detail) {
        throw new Error("invoice_detail not found");
      }
      await invoice_detail.destroy();
      return invoice_detail;
    } catch (error) {
      throw error;
    }
  };
}
