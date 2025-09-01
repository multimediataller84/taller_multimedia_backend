import type { IInvoiceDetailRepository } from "../domain/interfaces/IInvoiceDetailRepository.js";
import type { TInvoiceDetail } from "../domain/types/TInvoiceDetail.js";
import type { TInvoiceDetailEndpoint } from "../domain/types/TInvoiceDetailEndpoint.js";
import { InvoiceDetailService } from "../services/invoiceDetailService.js";

export class InvoiceDetailRepository implements IInvoiceDetailRepository {
  private static instance: InvoiceDetailRepository;
  private readonly invoiceDetailService = InvoiceDetailService.getInstance();

  public static getInstance(): InvoiceDetailRepository {
    if (!InvoiceDetailRepository.instance) {
      InvoiceDetailRepository.instance = new InvoiceDetailRepository();
    }
    return InvoiceDetailRepository.instance;
  }

  get = async (id: number): Promise<TInvoiceDetailEndpoint> => {
    try {
      const invoice_detail = await this.invoiceDetailService.get(id);
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
      const invoice_detail = await this.invoiceDetailService.getAll();
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
      const invoice_detail = await this.invoiceDetailService.post(data);
      if (!invoice_detail) {
        throw new Error("error at create invoice_detail");
      }
      return invoice_detail;
    } catch (error) {
      throw error;
    }
  };

  patch = async (id: number, data: TInvoiceDetail): Promise<TInvoiceDetailEndpoint> => {
    try {
      const invoice_detail = await this.invoiceDetailService.patch(id, data);
      if (!invoice_detail) {
        throw new Error("error at update source");
      }
      return invoice_detail;
    } catch (error) {
      throw error;
    }
  };

  delete = async (id: number): Promise<TInvoiceDetailEndpoint> => {
    try {
      const invoice_detail = await this.invoiceDetailService.delete(id);
      if (!invoice_detail) {
        throw new Error("error at delete source");
      }
      return invoice_detail;
    } catch (error) {
      throw error;
    }
  };
}
