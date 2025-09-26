import Invoice from "../domain/models/InvoiceModel.js";
import type { IInvoiceServices } from "../domain/interfaces/IInvoiceServices.js";
import type { TInvoiceEndpoint } from "../domain/types/TInvoiceEndpoint.js";
import type { TInvoice } from "../domain/types/TInvoice.js";
import Product from "../../Product/domain/models/ProductModel.js";
import Tax from "../../Tax/domain/models/TaxModel.js";
import { v4 as uuidv4 } from "uuid";
import Customer from "../../CustomerAccount/domain/models/CustomerModel.js";
export class InvoiceService implements IInvoiceServices {
  private static instance: InvoiceService;

  public static getInstance(): InvoiceService {
    if (!InvoiceService.instance) {
      InvoiceService.instance = new InvoiceService();
    }
    return InvoiceService.instance;
  }

  get = async (id: number): Promise<TInvoiceEndpoint> => {
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
    try {
      let subtotal = 0;
      let taxTotal = 0;

      const productsWithTax = await Promise.all(
        data.products.map(async (item) => {
          const product = await Product.findByPk(item.id);
          if (!product) throw new Error("Product not found");

          const tax = await Tax.findByPk(product.tax_id);
          if (!tax) throw new Error("Tax not found");

          const quantity = Number(item.quantity ?? 1);
          const unit_price = Number(product.unit_price);
          const profit_margin = Number(product.profit_margin);
          const percentage = Number(tax.percentage);

          const baseSubtotal = (unit_price + profit_margin) * quantity;
          const taxAmount = baseSubtotal * (percentage / 100);

          subtotal += baseSubtotal;
          taxTotal += taxAmount;

          return {
            product,
            quantity,
            subtotal: baseSubtotal + taxAmount,
            unit_price: product.unit_price,
          };
        })
      );

      const total = subtotal + taxTotal;
      const uuid = uuidv4();

      const invoice = await Invoice.create({
        customer_id: data.customer_id,
        issue_date: new Date(),
        due_date: data.due_date ?? null,
        subtotal,
        tax_total: taxTotal,
        total,
        payment_method: data.payment_method,
        status: data.status,
        invoice_number: uuid,
        biometric_hash: data.biometric_hash ?? null,
        digital_signature: data.digital_signature ?? null,
      });

      for (const product of productsWithTax) {
        await invoice.addProduct(product.product, {
          through: {
            quantity: product.quantity,
            unit_price: product.unit_price,
            subtotal: product.subtotal,
          },
        });
      }

      const invoice_dta = await Invoice.findOne({
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
        ],
      });
      return invoice_dta ?? invoice;
    } catch (error) {
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
