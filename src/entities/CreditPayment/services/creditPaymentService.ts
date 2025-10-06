import CreditPayment from "../domain/models/CreditPaymentModel.js";
import type { ICreditPaymentServices } from "../domain/interfaces/ICreditPaymentServices.js";
import type { TCreditPaymentEndpoint } from "../domain/types/TCreditPaymentEndpoint.js";
import type { TCreditPayment } from "../domain/types/TCreditPayment.js";
import Credit from "../../Credit/domain/models/CreditModel.js";
import Invoice from "../../Invoice/domain/models/InvoiceModel.js";
import { sequelize } from "../../../database/connection.js";

export class CreditPaymentService implements ICreditPaymentServices {
  private static instance: CreditPaymentService;

  public static getInstance(): CreditPaymentService {
    if (!CreditPaymentService.instance) {
      CreditPaymentService.instance = new CreditPaymentService();
    }
    return CreditPaymentService.instance;
  }

  get = async (id: number): Promise<TCreditPaymentEndpoint> => {
    try {
      const payment = await CreditPayment.findByPk(id, {
        include: [
          {
            model: Credit,
            as: "credit",
            attributes: ["id", "approved_credit_amount", "balance", "status"],
          },
          {
            model: Invoice,
            as: "invoice",
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
      if (!payment) {
        throw new Error("payment not found");
      }
      return payment;
    } catch (error) {
      throw error;
    }
  };

  getAll = async (): Promise<TCreditPaymentEndpoint[]> => {
    try {
      const payment = await CreditPayment.findAll({
        include: [
          {
            model: Credit,
            as: "credit",
            attributes: ["id", "approved_credit_amount", "balance", "status"],
          },
          {
            model: Invoice,
            as: "invoice",
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
      if (payment.length === 0) {
        throw new Error("payments not found");
      }
      return payment;
    } catch (error) {
      throw error;
    }
  };

  post = async (data: TCreditPayment): Promise<TCreditPaymentEndpoint> => {
    const transaction = await sequelize.transaction();

    try {
      const credit = await Credit.findByPk(data.credit_id, { transaction });
      if (!credit) throw new Error("Credit not found");

      const invoice = await Invoice.findByPk(data.invoice_id, { transaction });
      if (!invoice) throw new Error("Invoice not found");

      if (data.payment_method === "Credit")
        throw new Error("Cannot pay a credit with another credit");

      const amountPaid = Number(invoice.amount_paid ?? 0);
      const total = Number(invoice.total);
      const paymentAmount = Number(data.amount);

      if (amountPaid >= total) {
        throw new Error("Invoice is already fully paid");
      }

      if (amountPaid + paymentAmount > total) {
        throw new Error("Payment exceeds the total of the invoice");
      }

      await invoice.update(
        { amount_paid: amountPaid + paymentAmount },
        { transaction }
      );

      await credit.update(
        { balance: credit.balance + paymentAmount },
        { transaction }
      );

      const payment = await CreditPayment.create(
        {
          ...data,
          payment_date: new Date(),
        },
        { transaction }, 
      );

      await transaction.commit();
      return payment;
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  };

  patch = async (
    id: number,
    data: TCreditPayment
  ): Promise<TCreditPaymentEndpoint> => {
    try {
      const payment = await CreditPayment.findByPk(id);
      if (!payment) {
        throw new Error("payment not found");
      }
      await payment.update(data);
      const fixPayment = await this.get(id);

      return fixPayment ?? payment;
    } catch (error) {
      throw error;
    }
  };

  delete = async (id: number): Promise<TCreditPaymentEndpoint> => {
    try {
      const payment = await CreditPayment.findByPk(id, {
        include: [
          {
            model: Credit,
            as: "credit",
            attributes: ["id", "approved_credit_amount", "balance", "status"],
          },
          {
            model: Invoice,
            as: "invoice",
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
      if (!payment) {
        throw new Error("payment not found");
      }
      await payment.destroy();
      return payment;
    } catch (error) {
      throw error;
    }
  };
}
