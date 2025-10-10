import Invoice from "../../Invoice/domain/models/InvoiceModel.js";
import User from "../../User/domain/models/UserModel.js";
import type { ICashRegisterService } from "../domain/interfaces/ICashRegisterService.js";
import CashRegister from "../domain/models/CashRegisterModel.js";
import type { TCashRegister } from "../domain/types/TCashRegister.js";
import type { TCloseRegister } from "../domain/types/TCloseRegister.js";
import type { TOpenRegister } from "../domain/types/TOpenRegister.js";

export class CashRegisterService implements ICashRegisterService {
  public static instance: CashRegisterService;

  static getInstance(): CashRegisterService {
    if (!CashRegisterService.instance) {
      CashRegisterService.instance = new CashRegisterService();
    }
    return CashRegisterService.instance;
  }

  get = async (id: number): Promise<TCashRegister> => {
    try {
      const cashRegister = await CashRegister.findByPk(id, {
        include: [
          {
            model: Invoice,
            as: "invoices",
            attributes: [
              "id",
              "customer_id",
              "due_date",
              "subtotal",
              "tax_total",
              "total",
              "amount_paid",
              "payment_method",
              "status",
              "invoice_number",
              "cash_register_id",
            ],
          },
        ],
      });
      if (!cashRegister) {
        throw new Error("Cash Register not found");
      }
      return cashRegister;
    } catch (error) {
      throw error;
    }
  };

  getAll = async (): Promise<TCashRegister[]> => {
    try {
      const cashRegisters = await CashRegister.findAll({
        include: [
          {
            model: Invoice,
            as: "invoices",
            attributes: [
              "id",
              "customer_id",
              "due_date",
              "subtotal",
              "tax_total",
              "total",
              "amount_paid",
              "payment_method",
              "status",
              "invoice_number",
              "cash_register_id",
            ],
          },
        ],
      });
      if (cashRegisters.length === 0) {
        throw new Error("cash registered not found");
      }
      return cashRegisters;
    } catch (error) {
      throw error;
    }
  };

  post = async (data: TCashRegister): Promise<TCashRegister> => {
    try {
      const { user_id } = data;
      const employee = await User.findByPk(user_id);
      if (!employee) throw new Error("employee dont exists");

      const exists = await CashRegister.findOne({ where: { user_id } });
      if (exists) throw new Error("this user have a current cash registered");
      data.amount = data.opening_amount;
      const cashRegister = await CashRegister.create(data);
      return cashRegister;
    } catch (error) {
      throw error;
    }
  };

  patch = async (id: number, data: TCashRegister): Promise<TCashRegister> => {
    try {
      const cashRegisters = await CashRegister.findByPk(id);
      if (!cashRegisters) {
        throw new Error("Cash Registers not found");
      }
      await cashRegisters.update(data);

      const fixCashRegisters = await this.get(id);
      return fixCashRegisters ?? cashRegisters;
    } catch (error) {
      throw error;
    }
  };

  open = async (id: number, data: TOpenRegister): Promise<TCashRegister> => {
    const exists = await CashRegister.findOne({
      where: { user_id: data.user_id, status: "open" },
    });

    if (exists) {
      throw new Error("User already have opened cash register");
    }

    const register = await CashRegister.findByPk(id);
    if (!register) {
      throw new Error("Cash Registers not found");
    }

    return await register?.update({
      user_id: data.user_id,
      opening_amount: data.opening_amount,
      amount: data.opening_amount,
      opened_at: new Date(),
      status: "open" as const,
    });
  };

  close = async (id: number, data: TCloseRegister): Promise<TCashRegister> => {
    const register = await CashRegister.findByPk(id);

    if (!register) {
      throw new Error("Cash register not found");
    }

    if (register.status === "closed") {
      throw new Error("Cash register is already closed");
    }

    return await register.update({
      closing_amount: data.closing_amount,
      closed_at: new Date(),
      amount: data.closing_amount,
      status: "closed" as const,
    });
  };

  delete = async (id: number): Promise<TCashRegister> => {
    try {
      const cashRegister = await CashRegister.findByPk(id, {
        include: [
          {
            model: Invoice,
            as: "invoices",
            attributes: [
              "id",
              "customer_id",
              "due_date",
              "subtotal",
              "tax_total",
              "total",
              "amount_paid",
              "payment_method",
              "status",
              "invoice_number",
              "cash_register_id",
            ],
          },
        ],
      });
      if (!cashRegister) {
        throw new Error("credit not found");
      }
      await cashRegister.destroy();
      return cashRegister;
    } catch (error) {
      throw error;
    }
  };
}
