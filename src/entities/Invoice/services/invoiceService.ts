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
import type { TBuffer } from "../domain/types/TBuffer.js";
import User from "../../User/domain/models/UserModel.js";
import Role from "../../Role/domain/models/RoleModel.js";
import { ConvertJSON } from "../../ElectronicInvoice/services/pdf/convertJSON.js";
import { PDFFactory } from "../../ElectronicInvoice/services/pdf/PDFFactory.js";
import type { PDFType } from "../../ElectronicInvoice/domain/types/PDFType.js";
import { ConsecutiveService } from "../../ElectronicInvoice/services/generateConsecutive.js";
import { receiptTypes } from "../../ElectronicInvoice/domain/types/TReceiptTypes.js";
import { Transaction } from "sequelize";
import { InvoiceProcessor } from "../../ElectronicInvoice/services/hacienda/electroniceInvoiceService.js";
import { config } from "../../../utilities/config.js";
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
            model: User,
            as: "user",
            attributes: ["id", "name", "username"],
            include: [
              {
                model: Role,
                as: "role",
                attributes: ["id", "name"],
              },
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
            model: User,
            as: "user",
            attributes: ["id", "name", "username"],
            include: [
              {
                model: Role,
                as: "role",
                attributes: ["id", "name"],
              },
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

  post = async (data: TInvoice): Promise<TBuffer> => {
    const transaction = await sequelize.transaction();
    const time = Date.now();
    try {
      if (["Debit Card", "Transfer"].includes(data.payment_method)) {
        if (!data.payment_receipt?.trim()) {
          throw new Error(
            "Payment receipt is required for Debit Card or Transfer"
          );
        }

        const existingReceipt = await Invoice.findOne({
          where: { payment_receipt: data.payment_receipt },
          transaction,
          lock: Transaction.LOCK.KEY_SHARE,
        });

        if (existingReceipt) throw new Error("Payment receipt already exists");
      }

      const [customer, employee] = await Promise.all([
        Customer.findByPk(data.customer_id, { transaction }),
        User.findByPk(data.user_id, { transaction }),
      ]);

      if (!customer) throw new Error("Customer doesn't exist");
      if (!employee) throw new Error("Employee doesn't exist");

      let credit: Credit | null = null;

      if (data.payment_method === "Credit") {
        credit = await Credit.findOne({
          where: { customer_id: data.customer_id },
          transaction,
          lock: transaction.LOCK.UPDATE,
        });

        if (!credit || credit.status !== "Aproved") {
          throw new Error(
            `Customer doesn't have an approved credit (status: ${
              credit?.status ?? "none"
            })`
          );
        }
      }

      const productIds = data.products.map((p) => p.id).sort();
      const products = await Product.findAll({
        where: { id: productIds },
        include: [{ model: Tax, as: "tax" }],
        transaction,
        lock: { level: Transaction.LOCK.UPDATE, of: Product },
      });

      let subtotal = 0;
      let taxTotal = 0;

      const productsWithTax: any[] = [];

      for (const item of data.products) {
        const product = products.find((p) => p.id === item.id);
        if (!product) throw new Error(`Product ${item.id} not found`);

        const quantity = Number(item.quantity ?? 1);
        const tax = product.tax;
        if (!tax)
          throw new Error(`Tax not found for product ${product.product_name}`);

        if (product.stock < quantity) {
          throw new Error(
            `Product ${product.product_name} does not have enough stock`
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

        product.stock -= quantity;
      }

      await Promise.all(products.map((p) => p.save({ transaction })));

      const total = subtotal + taxTotal;
      const amount_paid = data.payment_method === "Credit" ? 0 : total;
      const uuid = uuidv4();

      if (data.payment_method === "Credit" && credit) {
        if (credit.balance < total) {
          throw new Error("The customer does not have sufficient funds");
        }

        await credit.update(
          { balance: credit.balance - total },
          { transaction }
        );
      }

      if (data.payment_method === "Cash") {
        const cashRegister = await CashRegister.findByPk(
          data.cash_register_id,
          {
            transaction,
            lock: Transaction.LOCK.UPDATE,
          }
        );

        if (!cashRegister) throw new Error("Cash register not found");
        if (cashRegister.status !== "open")
          throw new Error("The cash register is closed");

        const change = data.change_due ?? 0;
        const cashGiven = data.cash_given ?? 0;

        const registerAmount = parseFloat(String(cashRegister.amount));

        if (change && registerAmount < change)
          throw new Error("Insufficient funds in cash register");
        console.log(change, cashGiven, registerAmount);
        if (cashGiven) {
          const newAmount = parseFloat(
            (registerAmount + (cashGiven - change)).toFixed(2)
          );

          await cashRegister.update({ amount: newAmount }, { transaction });
        }
      }

      const consecutive = await ConsecutiveService.getNext(
        config.TERMINAL,
        data.cash_register_id.toString().padStart(2, "0"),
        receiptTypes.ELECTRONIC_INVOICE,
        transaction
      );

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
          user_id: data.user_id,
          status: data.status,
          invoice_number: uuid,
          payment_receipt: data.payment_receipt ?? null,
          biometric_hash: data.biometric_hash ?? null,
          digital_signature: data.digital_signature ?? null,
          cash_register_id: data.cash_register_id,
          branch: consecutive?.sucursal ?? null,
          consecutive: consecutive?.consecutive ?? null,
          consecutive_formatted: consecutive?.consecutiveFormatted ?? null,
          sequence: consecutive?.sequence ?? null,
          terminal: consecutive?.terminal ?? null,
          type: consecutive?.tipo ?? null,
        },
        { transaction }
      );

      await Promise.all(
        productsWithTax.map((p) =>
          invoice.addProduct(p.product, {
            through: {
              quantity: p.quantity,
              unit_price: p.unit_price,
              subtotal: p.subtotal,
            },
            transaction,
          })
        )
      );

      await transaction.commit();

      const pdfType: PDFType = "A4";

      const convertPdf = new ConvertJSON(
        invoice.dataValues,
        productsWithTax,
        consecutive
      );

      const invoiceProcesor = new InvoiceProcessor();
      console.log(
        await invoiceProcesor.processInvoice(await convertPdf.transformJSON())
      );

      const invoicePDF = PDFFactory.createPDF(
        pdfType,
        await convertPdf.transformJSON()
      );
      const buffer: Buffer = await invoicePDF.generate();
      console.log("time to execute: " + (Date.now() - time));
      return { name: uuid, file: buffer };
    } catch (error) {
      const anyTransaction = transaction as any;
      if (!anyTransaction.finished) {
        await transaction.rollback();
      }
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
    const transaction = await sequelize.transaction();
    try {
      const invoice =
        (await Invoice.findByPk(id, {
          transaction,
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
        })) ||
        (await Invoice.findOne({
          where: { invoice_number: String(id) },
          transaction,
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
        }));

      if (!invoice) {
        throw new Error("Invoice not found");
      }

      if (invoice.payment_method === "Credit") {
        const total = Number(invoice.total ?? 0);
        const paid = Number(invoice.amount_paid ?? 0);
        const pending = Math.max(total - paid, 0);

        if (pending > 0) {
          const credit = await Credit.findOne({
            where: { customer_id: invoice.customer_id },
            transaction,
          });

          if (credit) {
            const newBalance = Number(credit.balance ?? 0) + pending;
            await credit.update({ balance: newBalance }, { transaction });
          }
        }
      }

      if (invoice.products && invoice.products.length > 0) {
        await invoice.setProducts([], { transaction });
      }

      await invoice.destroy({ transaction });
      await transaction.commit();

      return invoice;
    } catch (error) {
      await transaction.rollback();
      throw new Error("Error at delete: " + error);
    }
  };
}
