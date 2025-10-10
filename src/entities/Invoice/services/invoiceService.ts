import Invoice from "../domain/models/InvoiceModel.js";
import type { IInvoiceServices } from "../domain/interfaces/IInvoiceServices.js";
import type { TInvoiceEndpoint } from "../domain/types/TInvoiceEndpoint.js";
import type { TInvoice } from "../domain/types/TInvoice.js";
import Product from "../../Product/domain/models/ProductModel.js";
import Tax from "../../Tax/domain/models/TaxModel.js";
import { v4 as uuidv4 } from "uuid";
import Customer from "../../CustomerAccount/domain/models/CustomerModel.js";
import { sequelize } from "../../../database/connection.js";
import Credit from "../../Credit/domain/models/CreditModel.js";
import CreditPayment from "../../CreditPayment/domain/models/CreditPaymentModel.js";
import CashRegister from "../../CashRegister/domain/models/CashRegisterModel.js";
export class InvoiceService implements IInvoiceServices {
  private static instance: InvoiceService;

  public static getInstance(): InvoiceService {
    if (!InvoiceService.instance) {
      InvoiceService.instance = new InvoiceService();
    }
    return InvoiceService.instance;
  }

  get = async (uuid: string): Promise<TInvoiceEndpoint> => {
    try {
      const invoice = await Invoice.findOne({
        where: { invoice_number: uuid },
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
              "phone",
              "email",
            ],
          },
          {
            model: Product,
            as: "products",
            attributes: ["id", "product_name", "sku"],
            through: { attributes: ["quantity", "unit_price", "subtotal"] },
          },
          {
            model: CreditPayment,
            as: "payments",
            attributes: [
              "id",
              "credit_id",
              "payment_date",
              "amount",
              "payment_method",
              "note",
              "createdAt",
            ],
          },
        ],
      });
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
      const invoice = await Invoice.findAll({
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
              "phone",
              "email",
            ],
          },
          {
            model: Product,
            as: "products",
            attributes: ["id", "product_name", "sku"],
            through: { attributes: ["quantity", "unit_price", "subtotal"] },
          },
          {
            model: CreditPayment,
            as: "payments",
            attributes: [
              "id",
              "credit_id",
              "payment_date",
              "amount",
              "payment_method",
              "note",
              "createdAt",
            ],
          },
        ],
      });
      if (invoice.length === 0) {
        throw new Error("invoices not found");
      }
      return invoice;
    } catch (error) {
      throw error;
    }
  };

  post = async (data: TInvoice): Promise<TInvoiceEndpoint> => {
    const transaction = await sequelize.transaction();

    try {
      const customer = await Customer.findByPk(data.customer_id, {
        transaction,
        lock: transaction.LOCK.UPDATE,
      });
      if (!customer) throw new Error("Customer dont exist");

      let credit: Credit | null = null;

      if (data.payment_method === "Credit") {
        credit = await Credit.findOne({
          where: { customer_id: data.customer_id },
          transaction,
          lock: transaction.LOCK.UPDATE,
        });

        if (credit?.status !== "Aproved") {
          throw new Error(
            `Customer doesn't have a credit approved, status: ${credit?.status}`
          );
        }
      }

      let subtotal = 0;
      let taxTotal = 0;

      const productsWithTax = [];

      for (const item of data.products) {
        const product = await Product.findByPk(item.id, {
          transaction,
          lock: transaction.LOCK.UPDATE,
        });
        if (!product) throw new Error("Product not found");

        const tax = await Tax.findByPk(product.tax_id, { transaction });
        if (!tax) throw new Error("Tax not found");

        const quantity = Number(item.quantity ?? 1);

        if (product.stock < quantity) {
          throw new Error(
            `Product ${product.product_name} id:${product?.id} of order doesn't have enough stock`
          );
        }

        const unit_price = Number(product.unit_price);
        const profit_margin = Number(product.profit_margin);
        const percentage = Number(tax.percentage);

        const baseSubtotal = (unit_price + profit_margin) * quantity;
        const taxAmount = baseSubtotal * (percentage / 100);

        subtotal += baseSubtotal;
        taxTotal += taxAmount;

        productsWithTax.push({
          product,
          quantity,
          subtotal: baseSubtotal + taxAmount,
          unit_price: product.unit_price,
        });

        await product.update(
          { stock: product.stock - quantity },
          { transaction }
        );
      }

      const total = subtotal + taxTotal;
      const amount_paid = data.payment_method === "Credit" ? 0 : total;
      const uuid = uuidv4();

      if (data.payment_method === "Credit") {
        if (!credit) throw new Error("Credit not found");

        if (credit.balance < total) {
          throw new Error("The customer does not have sufficient funds");
        }

        await credit.update(
          { balance: credit.balance - total },
          { transaction }
        );
      }

      if (data.payment_method === "Cash") {
        const registered = await CashRegister.findByPk(data.cash_register_id, {
          transaction,
          lock: transaction.LOCK.UPDATE,
        });

        if (!registered) {
          throw new Error("Cash register not found.");
        }

        if (registered.status !== "open") {
          throw new Error("The cash register is closed.");
        }

        if (registered.amount < total) {
          throw new Error("Insufficient funds in cash register.");
        }

        const newAmount = parseFloat((registered.amount - total).toFixed(2));

        await registered.update({ amount: newAmount }, { transaction });
      }

      const invoice = await Invoice.create(
        {
          customer_id: data.customer_id,
          issue_date: new Date(),
          due_date: data.due_date ?? null,
          subtotal,
          tax_total: taxTotal,
          total,
          amount_paid,
          payment_method: data.payment_method,
          status: data.status,
          invoice_number: uuid,
          biometric_hash: data.biometric_hash ?? null,
          digital_signature: data.digital_signature ?? null,
          cash_register_id: data.cash_register_id,
        },
        { transaction }
      );

      for (const product of productsWithTax) {
        await invoice.addProduct(product.product, {
          through: {
            quantity: product.quantity,
            unit_price: product.unit_price,
            subtotal: product.subtotal,
          },
          transaction,
        });
      }

      await transaction.commit();

      const updateInvoice = await this.get(uuid);

      return updateInvoice ?? invoice;
    } catch (error) {
      await transaction.rollback();
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

      const invoice_dta = await Invoice.findByPk(id, {
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
              "phone",
              "email",
            ],
          },
          {
            model: Product,
            as: "products",
            attributes: ["id", "product_name", "sku"],
            through: { attributes: ["quantity", "unit_price", "subtotal"] },
          },
          {
            model: CreditPayment,
            as: "payments",
            attributes: [
              "id",
              "credit_id",
              "payment_date",
              "amount",
              "payment_method",
              "note",
              "createdAt",
            ],
          },
        ],
      });
      return invoice_dta ?? invoice;
    } catch (error) {
      throw error;
    }
  };

  delete = async (id: number): Promise<TInvoiceEndpoint> => {
    try {
      const invoice = await Invoice.findByPk(id, {
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
              "phone",
              "email",
            ],
          },
          {
            model: Product,
            as: "products",
            attributes: ["id", "product_name", "sku"],
            through: { attributes: ["quantity", "unit_price", "subtotal"] },
          },
          {
            model: CreditPayment,
            as: "payments",
            attributes: [
              "id",
              "credit_id",
              "payment_date",
              "amount",
              "payment_method",
              "note",
              "createdAt",
            ],
          },
        ],
      });
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
