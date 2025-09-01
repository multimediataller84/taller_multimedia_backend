import Invoice from "../domain/models/InvoiceModel.js";
import type { IInvoiceServices } from "../domain/interfaces/IInvoiceServices.js";
import type { TInvoiceEndpoint } from "../domain/types/TInvoiceEndpoint.js";
import type { TInvoice } from "../domain/types/TInvoice.js";

export class InvoiceService implements IInvoiceServices {
  private static instance: InvoiceService;

  public static getInstance(): InvoiceService {
    if (!InvoiceService.instance) {
      InvoiceService.instance = new InvoiceService();
    }
    return InvoiceService.instance;
  }

  get = async (id: number): Promise<TInvoiceEndpoint> => {
    try {
      const invoice = await Invoice.findByPk(id);
      if (!invoice) {
        throw new Error("invoice not found");
      }
      return invoice;
    } catch (error) {
      throw error;
    }
  };

  getAll = async (): Promise<TInvoiceEndpoint[]> => {
    try {
      const invoice = await Invoice.findAll();
      if (invoice.length === 0) {
        throw new Error("invoices not found");
      }
      return invoice;
    } catch (error) {
      throw error;
    }
  };

  post = async (data: TInvoice): Promise<TInvoiceEndpoint> => {
    try {
      const { invoice_number } = data;
      const exists = await Invoice.findOne({ where: { invoice_number } });
      if (exists) throw new Error("invoice already exists");

      const invoice = await Invoice.create(data);
      return invoice;
    } catch (error) {
      throw error;
    }
  };

  patch = async (id: number, data: TInvoice): Promise<TInvoiceEndpoint> => {
    try {
      const invoice = await Invoice.findByPk(id);
      if (!invoice) {
        throw new Error("invoice not found");
      }
      await invoice.update(data);
      return invoice;
    } catch (error) {
      throw error;
    }
  };

  delete = async (id: number): Promise<TInvoiceEndpoint> => {
    try {
      const invoice = await Invoice.findByPk(id);
      if (!invoice) {
        throw new Error("invoice not found");
      }
      await invoice.destroy();
      return invoice;
    } catch (error) {
      throw error;
    }
  };
}
