import type { TCanton } from "../domain/types/TCanton.js";
import type { TDistrict } from "../domain/types/TDistrict.js";
import type { TProvince } from "../domain/types/TProvince.js";
import type { ICustomerRepository } from "../domain/interfaces/ICustomerRepository.js";
import type { TCustomer } from "../domain/types/TCustomer.js";
import type { TCustomerEndpoint } from "../domain/types/TCustomerEndpoint.js";
import { CustomerService } from "../services/customerService.js";

export class CustomerRepository implements ICustomerRepository {
  private static instance: CustomerRepository;
  private readonly customerService = CustomerService.getInstance();

  public static getInstance(): CustomerRepository {
    if (!CustomerRepository.instance) {
      CustomerRepository.instance = new CustomerRepository();
    }
    return CustomerRepository.instance;
  }

  get = async (id: number): Promise<TCustomerEndpoint> => {
    try {
      const customer = await this.customerService.get(id);
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
      const customer = await this.customerService.getAll();
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
      const customer = await this.customerService.getAllProvince();
      return customer;
    } catch (error) {
      throw error;
    }
  };

  getAllCanton = async (): Promise<TCanton[]> => {
    try {
      const customer = await this.customerService.getAllCanton();
      return customer;
    } catch (error) {
      throw error;
    }
  };

  getAllDistrict = async (): Promise<TDistrict[]> => {
    try {
      const customer = await this.customerService.getAllDistrict();
      return customer;
    } catch (error) {
      throw error;
    }
  };

  post = async (data: TCustomer): Promise<TCustomerEndpoint> => {
    try {
      const customer = await this.customerService.post(data);
      if (!customer) {
        throw new Error("error at create customer");
      }
      return customer;
    } catch (error) {
      throw error;
    }
  };

  patch = async (id: number, data: TCustomer): Promise<TCustomerEndpoint> => {
    try {
      const customer = await this.customerService.patch(id, data);
      if (!customer) {
        throw new Error("error at update source");
      }
      return customer;
    } catch (error) {
      throw error;
    }
  };

  delete = async (id: number): Promise<TCustomerEndpoint> => {
    try {
      const customer = await this.customerService.delete(id);
      if (!customer) {
        throw new Error("error at delete source");
      }
      return customer;
    } catch (error) {
      throw error;
    }
  };
}
