import Customer from "../domain/models/CustomerModel.js";
import type { ICustomerServices } from "../domain/interfaces/ICustomerServices.js";
import type { TCustomerEndpoint } from "../domain/types/TCustomerEndpoint.js";
import type { TCustomer } from "../domain/types/TCustomer.js";
import Credit from "../../Credit/domain/models/CreditModel.js";
import Invoice from "../../Invoice/domain/models/InvoiceModel.js";

export class CustomerService implements ICustomerServices {
  private static instance: CustomerService;

  public static getInstance(): CustomerService {
    if (!CustomerService.instance) {
      CustomerService.instance = new CustomerService();
    }
    return CustomerService.instance;
  }

  get = async (id: number): Promise<TCustomerEndpoint> => {
    try {
      const customer = await Customer.findByPk(id, {
        include: [
          {
            model: Credit,
            as: "credit",
            attributes: ["id", "approved_credit_amount", "balance", "status"],
          },
          {
            model: Invoice,
            as: "invoices",
            attributes: [
              "id",
              "issue_date",
              "due_date",
              "subtotal",
              "tax_total",
              "total",
              "amount_paid",
              "payment_method",
              "status",
              "invoice_number",
              "digital_signature",
              "biometric_hash",
            ],
          },
        ],
      });
      if (!customer) {
        throw new Error("customer not found");
      }
      return customer;
    } catch (error) {
      throw error;
    }
  };

  getAll = async (): Promise<TCustomerEndpoint[]> => {
    try {
      const customer = await Customer.findAll({
        include: [
          {
            model: Credit,
            as: "credit",
            attributes: ["id", "approved_credit_amount", "balance", "status"],
          },
          {
            model: Invoice,
            as: "invoices",
            attributes: [
              "id",
              "issue_date",
              "due_date",
              "subtotal",
              "tax_total",
              "total",
              "amount_paid",
              "payment_method",
              "status",
              "invoice_number",
              "digital_signature",
              "biometric_hash",
            ],
          },
        ],
      });
      if (customer.length === 0) {
        throw new Error("customers not found");
      }
      return customer;
    } catch (error) {
      throw error;
    }
  };

  post = async (data: TCustomer): Promise<TCustomerEndpoint> => {
    try {
      const { id_number } = data;
      const exists = await Customer.findOne({ where: { id_number } });
      if (exists) throw new Error("Customer already exists");

      const customer = await Customer.create(data);
      return customer;
    } catch (error) {
      throw error;
    }
  };

  patch = async (id: number, data: TCustomer): Promise<TCustomerEndpoint> => {
    try {
      const customer = await Customer.findByPk(id);
      if (!customer) {
        throw new Error("customer not found");
      }
      await customer.update(data);
      const customerFix = await this.get(id);

      return customerFix ?? customer;
    } catch (error) {
      throw error;
    }
  };

  delete = async (id: number): Promise<TCustomerEndpoint> => {
    try {
      const customer = await Customer.findByPk(id, {
        include: [
          {
            model: Credit,
            as: "credit",
            attributes: ["id", "approved_credit_amount", "balance", "status"],
          },
          {
            model: Invoice,
            as: "invoices",
            attributes: [
              "id",
              "issue_date",
              "due_date",
              "subtotal",
              "tax_total",
              "total",
              "amount_paid",
              "payment_method",
              "status",
              "invoice_number",
              "digital_signature",
              "biometric_hash",
            ],
          },
        ],
      });
      if (!customer) {
        throw new Error("customer not found");
      }
      await customer.destroy();
      return customer;
    } catch (error) {
      throw error;
    }
  };
}
