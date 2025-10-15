import Customer from "../domain/models/CustomerModel.js";
import type { ICustomerServices } from "../domain/interfaces/ICustomerServices.js";
import type { TCustomerEndpoint } from "../domain/types/TCustomerEndpoint.js";
import type { TCustomer } from "../domain/types/TCustomer.js";
import Credit from "../../Credit/domain/models/CreditModel.js";
import Invoice from "../../Invoice/domain/models/InvoiceModel.js";
import Province from "../domain/models/ProvinceModel.js";
import Canton from "../domain/models/CantonModel.js";
import District from "../domain/models/DistrictModel.js";
import type { TDistrict } from "../domain/types/TDistrict.js";
import type { TCanton } from "../domain/types/TCanton.js";
import type { TProvince } from "../domain/types/TProvince.js";

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
          { model: Province, as: "province", attributes: ["id", "name"] },
          { model: Canton, as: "canton", attributes: ["id", "name"] },
          { model: District, as: "district", attributes: ["id", "name"] },
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
          { model: Province, as: "province", attributes: ["id", "name"] },
          { model: Canton, as: "canton", attributes: ["id", "name"] },
          { model: District, as: "district", attributes: ["id", "name"] },
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

  getAllProvince = async (): Promise<TProvince[]> => {
    try {
      const provinces = await Province.findAll();
      if (provinces.length === 0) throw new Error("provinces dont exist");
      return provinces;
    } catch (error) {
      throw new Error("error" + error);
    }
  };

  getAllCanton = async (): Promise<TCanton[]> => {
    try {
      const canton = await Canton.findAll();
      if (canton.length === 0) throw new Error("canton dont exist");
      return canton;
    } catch (error) {
      throw new Error("error" + error);
    }
  };

  getAllDistrict = async (): Promise<TDistrict[]> => {
    try {
      const district = await District.findAll();
      if (district.length === 0) throw new Error("district dont exist");
      return district;
    } catch (error) {
      throw new Error("error" + error);
    }
  };

  post = async (data: TCustomer): Promise<TCustomerEndpoint> => {
    try {
      const { email, id_number } = data;
      const exists = await Customer.findOne({ where: { id_number } });
      if (exists) throw new Error("Customer already exists");

      const emailExist = await Customer.findOne({ where: { email } });
      if (emailExist) throw new Error("Customer already exists");

      const cantonExist = await Canton.findOne({
        where: { id: data.canton_id },
      });
      if (!cantonExist) throw new Error("canton dont exists");

      const provinceExist = await Province.findOne({
        where: { id: data.province_id },
      });
      if (!provinceExist) throw new Error("province dont exists");

      const districtExist = await District.findOne({
        where: { id: data.district_id },
      });
      if (!districtExist) throw new Error("district dont exists");

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
          { model: Province, as: "province", attributes: ["id", "name"] },
          { model: Canton, as: "canton", attributes: ["id", "name"] },
          { model: District, as: "district", attributes: ["id", "name"] },
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
