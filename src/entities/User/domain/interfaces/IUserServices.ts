import type { TLogin } from "../types/TLogin.js";
import type { TPayload } from "../types/TPayload.js";
import type { TUser } from "../types/TUser.js";
import type { TUserEndpoint } from "../types/TUserEndpoint.js";

export interface IUserServices {
  get: (id: number) => Promise<TUserEndpoint>;
  getAll: () => Promise<TUserEndpoint[]>;
  post: (data: TUser) =>Promise<TUserEndpoint>;
  delete: (id: number) => Promise<TUserEndpoint>;
  patch: (id: number, data: TUser) => Promise<TUserEndpoint>;  
  login: (data: TLogin) => Promise<TPayload>;
}
