import Credit from "../domain/models/CreditModel.js";
import type { ICreditServices } from "../domain/interfaces/ICreditServices.js";
import type { TCreditEndpoint } from "../domain/types/TCreditEndpoint.js";
import type { TCredit } from "../domain/types/TCredit.js";
import Customer from "../../CustomerAccount/domain/models/CustomerModel.js";
import CreditPayment from "../../CreditPayment/domain/models/CreditPaymentModel.js";

export class CreditService implements ICreditServices {
  private static instance: CreditService;

  public static getInstance(): CreditService {
    if (!CreditService.instance) {
      CreditService.instance = new CreditService();
    }
    return CreditService.instance;
  }

  get = async (id: number): Promise<TCreditEndpoint> => {
    try {
      const credit = await Credit.findByPk(id, {
        include: [
          {
            model: Customer,
            as: "customer",
            attributes: [
              "id",
              "name",
              "last_name",
              "address",
              "id_number",
              "email",
              "phone",
            ],
          },
          {
            model: CreditPayment,
            as: "payments",
            attributes: [
              "id",
              "credit_id",
              "invoice_id",
              "payment_date",
              "amount",
              "payment_method",
              "note",
            ],
          },
        ],
      });
      if (!credit) {
        throw new Error("credit not found");
      }
      return credit;
    } catch (error) {
      throw error;
    }
  };

  getAll = async (): Promise<TCreditEndpoint[]> => {
    try {
      const credit = await Credit.findAll({
        include: [
          {
            model: Customer,
            as: "customer",
            attributes: [
              "id",
              "name",
              "last_name",
              "address",
              "id_number",
              "email",
              "phone",
            ],
          },
          {
            model: CreditPayment,
            as: "payments",
            attributes: [
              "id",
              "credit_id",
              "invoice_id",
              "payment_date",
              "amount",
              "payment_method",
              "note",
            ],
          },
        ],
      });
      if (credit.length === 0) {
        throw new Error("credit not found");
      }
      return credit;
    } catch (error) {
      throw error;
    }
  };

  post = async (data: TCredit): Promise<TCreditEndpoint> => {
    try {
      const { customer_id } = data;
      const customer = await Customer.findByPk(customer_id);
      if (!customer) throw new Error("Customer dont exists");

      const exists = await Credit.findOne({ where: { customer_id } });
      if (exists) throw new Error("this customer have a current credit");

      data.balance = data.approved_credit_amount;
      const credit = await Credit.create(data);
      return credit;
    } catch (error) {
      throw error;
    }
  };

  patch = async (id: number, data: TCredit): Promise<TCreditEndpoint> => {
    try {
      const credit = await Credit.findByPk(id);
      if (!credit) {
        throw new Error("credit not found");
      }
      await credit.update(data);

      const fixCredit = await this.get(id);
      return fixCredit ?? credit;
    } catch (error) {
      throw error;
    }
  };

  delete = async (id: number): Promise<TCreditEndpoint> => {
    try {
      const credit = await Credit.findByPk(id, {
        include: [
          {
            model: Customer,
            as: "customer",
            attributes: [
              "id",
              "name",
              "last_name",
              "address",
              "id_number",
              "email",
              "phone",
            ],
          },
          {
            model: CreditPayment,
            as: "payments",
            attributes: [
              "id",
              "credit_id",
              "invoice_id",
              "payment_date",
              "amount",
              "payment_method",
              "note",
            ],
          },
        ],
      });
      if (!credit) {
        throw new Error("credit not found");
      }
      await credit.destroy();
      return credit;
    } catch (error) {
      throw error;
    }
  };
}
