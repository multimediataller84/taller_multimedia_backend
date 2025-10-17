import type { TIdentificationType } from "./TIdentificationType.js";

export type TCustomer = {
  name: string;
  last_name: string;
  address: string;
  id_number: string;
  email: string;
  phone: number;
  identification_type: TIdentificationType;
  province_id: number;
  canton_id: number;
  district_id: number;
};
