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
      const payments = await CreditPayment.findAll({
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
      if (!payments) throw new Error("payment not found");

      return payments;
    } catch (error) {
      throw new Error("error: " + error);
    }
  };

  getAllByUser = async (id: number): Promise<TCreditPaymentEndpoint[]> => {
    try {
      const payments = await CreditPayment.findAll({
        where: { credit_id: id },
        order: [["createdAt", "DESC"]],
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
      if (!payments) throw new Error("payment not found");

      return payments;
    } catch (error) {
      throw new Error("error: " + error);
    }
  };

  post = async (data: TCreditPayment): Promise<TCreditPaymentEndpoint> => {
    const transaction = await sequelize.transaction();
    try {
      const credit = await Credit.findByPk(data.credit_id, {
        transaction,
        lock: transaction.LOCK.UPDATE,
      });
      if (!credit) throw new Error("Credit not found");

      const invoice = await Invoice.findByPk(data.invoice_id, {
        transaction,
        lock: transaction.LOCK.UPDATE,
      });
      if (!invoice) throw new Error("Invoice not found");

      if (data.payment_method === "Credit") {
        throw new Error("Cannot pay a credit with another credit");
      }

      const amountPaid = Number(invoice.amount_paid ?? 0);
      const total = Number(invoice.total);
      const paymentAmount = Number(data.amount);

      if (amountPaid >= total) throw new Error("Invoice is already fully paid");
      if (amountPaid + paymentAmount > total)
        throw new Error("Payment exceeds the total of the invoice");

      const newPaid = amountPaid + paymentAmount;
      invoice.set({ amount_paid: newPaid });
      await invoice.save({ transaction });

      const newBalance = Number(credit.balance) + paymentAmount;
      await credit.update({ balance: newBalance }, { transaction });

      const payment = await CreditPayment.create(
        {
          ...data,
          payment_date: new Date(),
        },
        { transaction }
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
    const transaction = await sequelize.transaction();
    try {
      const payment = await CreditPayment.findByPk(id, {
        transaction,
        lock: transaction.LOCK.UPDATE,
      });
      if (!payment) throw new Error("payment not found");

      const credit = await Credit.findByPk(payment.credit_id, {
        transaction,
        lock: transaction.LOCK.UPDATE,
      });
      if (!credit) throw new Error("credit not found");

      const invoice = await Invoice.findByPk(payment.invoice_id, {
        transaction,
        lock: transaction.LOCK.UPDATE,
      });
      if (!invoice) throw new Error("invoice not found");

      const amount = Number(payment.amount);

      const revertedPaid = Math.max(
        Number(invoice.amount_paid ?? 0) - amount,
        0
      );
      await invoice.update({ amount_paid: revertedPaid }, { transaction });

      const revertedBalance = Math.max(Number(credit.balance) - amount, 0);
      await credit.update({ balance: revertedBalance }, { transaction });

      await payment.destroy({ transaction });

      await transaction.commit();

      const out = await CreditPayment.findByPk(id, {
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
        paranoid: false,
      });

      return out ?? payment;
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  };
}
