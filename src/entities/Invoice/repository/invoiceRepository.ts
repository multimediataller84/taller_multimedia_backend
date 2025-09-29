import type { IInvoiceRepository } from "../domain/interfaces/IInvoiceRepository.js";
import type Invoice from "../domain/models/InvoiceModel.js";
import type { ProdutList, TInvoice } from "../domain/types/TInvoice.js";
import type { TInvoiceEndpoint } from "../domain/types/TInvoiceEndpoint.js";
import { InvoiceService } from "../services/invoiceService.js";

export class InvoiceRepository implements IInvoiceRepository {
  private static instance: InvoiceRepository;
  private readonly invoiceService = InvoiceService.getInstance();

  public static getInstance(): InvoiceRepository {
    if (!InvoiceRepository.instance) {
      InvoiceRepository.instance = new InvoiceRepository();
    }
    return InvoiceRepository.instance;
  }

  get = async (uuid: string): Promise<TInvoiceEndpoint> => {
    try {
      const invoice = await this.invoiceService.get(uuid);
      if (!invoice) {
        throw new Error("source not found");
      }
      return invoice;
    } catch (error) {
      throw error;
    }
  };

  getAll = async (): Promise<TInvoiceEndpoint[]> => {
    try {
      const invoice = await this.invoiceService.getAll();
      if (invoice.length === 0) {
        throw new Error("sources not found");
      }
      return invoice;
    } catch (error) {
      throw error;
    }
  };

  post = async (data: TInvoice): Promise<TInvoiceEndpoint> => {
    try {
      const invoice = await this.invoiceService.post(data);
      if (!invoice) {
        throw new Error("error at create customer");
      }
      return invoice;
    } catch (error) {
      throw error;
    }
  };

  patch = async (id: number, data: TInvoice): Promise<TInvoiceEndpoint> => {
    try {
      const invoice = await this.invoiceService.patch(id, data);
      if (!invoice) {
        throw new Error("error at update source");
      }
      return invoice;
    } catch (error) {
      throw error;
    }
  };

  delete = async (id: number): Promise<TInvoiceEndpoint> => {
    try {
      const invoice = await this.invoiceService.delete(id);
      if (!invoice) {
        throw new Error("error at delete source");
      }
      return invoice;
    } catch (error) {
      throw error;
    }
  };
}
