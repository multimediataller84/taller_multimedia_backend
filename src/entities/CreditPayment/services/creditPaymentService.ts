import CreditPayment from "../domain/models/CreditPaymentModel.js";
import type { ICreditPaymentServices } from "../domain/interfaces/ICreditPaymentServices.js";
import type { TCreditPaymentEndpoint } from "../domain/types/TCreditPaymentEndpoint.js";
import type { TCreditPayment } from "../domain/types/TCreditPayment.js";
import Credit from "../../Credit/domain/models/CreditModel.js";
import Invoice from "../../Invoice/domain/models/InvoiceModel.js";
import { sequelize } from "../../../database/connection.js";
import { Op, type FindOptions } from "sequelize";

export class CreditPaymentService implements ICreditPaymentServices {
  private static instance: CreditPaymentService;

  public static getInstance(): CreditPaymentService {
    if (!CreditPaymentService.instance) {
      CreditPaymentService.instance = new CreditPaymentService();
    }
    return CreditPaymentService.instance;
  }

  get = async (id: number): Promise<TCreditPaymentEndpoint> => {
    const payment = await CreditPayment.findByPk(id, {
      include: [
        { model: Credit, as: "credit", attributes: ["id", "approved_credit_amount", "balance", "status"] },
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
    if (!payment) throw new Error("payment not found");
    return payment;
  };

  getAll = async (credit_id?: number): Promise<TCreditPaymentEndpoint[]> => {
    const options: FindOptions = {
      order: [["createdAt", "DESC"]],
      include: [
        { model: Credit, as: "credit", attributes: ["id", "approved_credit_amount", "balance", "status"] },
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
    };

    if (typeof credit_id === "number") {
      options.where = { credit_id: { [Op.eq]: credit_id } };
    }

    const payments = await CreditPayment.findAll(options);
    return payments ?? [];
  };

  post = async (data: TCreditPayment): Promise<TCreditPaymentEndpoint> => {
    const transaction = await sequelize.transaction();
    try {
      const credit = await Credit.findByPk(data.credit_id, { transaction, lock: transaction.LOCK.UPDATE });
      if (!credit) throw new Error("Credit not found");

      const invoice = await Invoice.findByPk(data.invoice_id, { transaction, lock: transaction.LOCK.UPDATE });
      if (!invoice) throw new Error("Invoice not found");

      if (data.payment_method === "Credit") {
        throw new Error("Cannot pay a credit with another credit");
      }

      const amountPaid = Number(invoice.amount_paid ?? 0);
      const total = Number(invoice.total);
      const paymentAmount = Number(data.amount);

      if (amountPaid >= total) throw new Error("Invoice is already fully paid");
      if (amountPaid + paymentAmount > total) throw new Error("Payment exceeds the total of the invoice");

      const newPaid = amountPaid + paymentAmount;
      invoice.set({ amount_paid: newPaid });
      await invoice.save({ transaction });

      const newBalance = Number(credit.balance) + paymentAmount;
      credit.set({ balance: newBalance });
      await credit.save({ transaction });

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

  patch = async (id: number, data: TCreditPayment): Promise<TCreditPaymentEndpoint> => {
    const payment = await CreditPayment.findByPk(id);
    if (!payment) throw new Error("payment not found");
    await payment.update(data);
    return this.get(id);
  };

  delete = async (id: number): Promise<TCreditPaymentEndpoint> => {
    
    const transaction = await sequelize.transaction();
    try {
      const payment = await CreditPayment.findByPk(id, {
        transaction,
        lock: transaction.LOCK.UPDATE,
      });
      if (!payment) throw new Error("payment not found");

      const credit = await Credit.findByPk(payment.credit_id, { transaction, lock: transaction.LOCK.UPDATE });
      if (!credit) throw new Error("credit not found");

      const invoice = await Invoice.findByPk(payment.invoice_id, { transaction, lock: transaction.LOCK.UPDATE });
      if (!invoice) throw new Error("invoice not found");

      const amount = Number(payment.amount);

      const revertedPaid = Math.max(Number(invoice.amount_paid ?? 0) - amount, 0);
      invoice.set({ amount_paid: revertedPaid });
      await invoice.save({ transaction });

      const revertedBalance = Math.max(Number(credit.balance) - amount, 0);
      credit.set({ balance: revertedBalance });
      await credit.save({ transaction });

      await payment.destroy({ transaction });

      await transaction.commit();

      const out = await CreditPayment.findByPk(id, {
        include: [
          { model: Credit, as: "credit", attributes: ["id", "approved_credit_amount", "balance", "status"] },
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

      return (out as unknown as TCreditPaymentEndpoint) ?? (payment as any);
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  };
}
