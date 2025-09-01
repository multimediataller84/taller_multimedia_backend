import Customer from "../domain/models/CustomerModel.js";
import type { ICustomerServices } from "../domain/interfaces/ICustomerServices.js";
import type { TCustomerEndpoint } from "../domain/types/TCustomerEndpoint.js";
import type { TCustomer } from "../domain/types/TCustomer.js";

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
      const customer = await Customer.findByPk(id);
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
      const customer = await Customer.findAll();
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
      return customer;
    } catch (error) {
      throw error;
    }
  };

  delete = async (id: number): Promise<TCustomerEndpoint> => {
    try {
      const customer = await Customer.findByPk(id);
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
