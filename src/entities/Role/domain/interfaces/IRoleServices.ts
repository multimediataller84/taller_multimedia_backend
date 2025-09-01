import type { TRole } from "../types/TRole.js";
import type { TRoleEndpoint } from "../types/TRoleEndpoint.js";

export interface IRoleServices {
  get: (id: number) => Promise<TRoleEndpoint>;
  getAll: () => Promise<TRoleEndpoint[]>;
  post: (data: TRole) => Promise<TRoleEndpoint>;
  delete: (id: number) => Promise<TRoleEndpoint>;
  patch: (id: number, data: TRole) => Promise<TRoleEndpoint>;
}
