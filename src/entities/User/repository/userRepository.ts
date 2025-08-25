import type { IUserRepository } from "../domain/interfaces/IUserRepository.js";
import type { TLogin } from "../domain/types/TLogin.js";
import type { TPayload } from "../domain/types/TPayload.js";
import type { TUser } from "../domain/types/TUser.js";
import type { TUserEndpoint } from "../domain/types/TUserEndpoint.js";
import { UserService } from "../services/userService.js";

export class UserRepository implements IUserRepository {
  private static instance: UserRepository;
  private readonly userService = UserService.getInstance();

  public static getInstance(): UserRepository {
    if (!UserRepository.instance) {
      UserRepository.instance = new UserRepository();
    }
    return UserRepository.instance;
  }

  get = async (id: number): Promise<TUserEndpoint> => {
    try {
      const user = await this.userService.get(id);
      if (!user) {
        throw new Error("user not found");
      }
      return user;
    } catch (error) {
      throw error;
    }
  };

  getAll = async (): Promise<TUserEndpoint[]> => {
    try {
      const user = await this.userService.getAll();
      if (user.length === 0) {
        throw new Error("user not found");
      }
      return user;
    } catch (error) {
      throw error;
    }
  };

  post = async (data: TUser): Promise<TUserEndpoint> => {
   try {
      const user = await this.userService.post(data);
      if (!user) {
        throw new Error("error at login");
      }
      return user;
    } catch (error) {
      throw error;
    }
  };

  patch = async (id: number, data: TUser): Promise<TUserEndpoint> => {
    try {
      const user = await this.userService.patch(id, data);
      if (!user) {
        throw new Error("error at update source");
      }
      return user;
    } catch (error) {
      throw error;
    }
  };

  delete = async (id: number): Promise<TUserEndpoint> => {
    try {
      const user = await this.userService.delete(id);
      if (!user) {
        throw new Error("error at delete source");
      }
      return user;
    } catch (error) {
      throw error;
    }
  };

  login = async (data: TLogin): Promise<TPayload> => {
    try {
      const user = await this.userService.login(data);
      if (!user) {
        throw new Error("error at login");
      }
      return user;
    } catch (error) {
      throw error;
    }
  };

}
