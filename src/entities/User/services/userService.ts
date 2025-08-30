import User from "../domain/models/UserModel.js";
import type { IUserServices } from "../domain/interfaces/IUserServices.js";
import type { TUserEndpoint } from "../domain/types/TUserEndpoint.js";
import type { TUser } from "../domain/types/TUser.js";
import type { TLogin } from "../domain/types/TLogin.js";
import bcrypt from "bcrypt";
import * as jwt from "jsonwebtoken";
import { config } from "../../../utilities/config.js";
import type { TPayload } from "../domain/types/TPayload.js";

export class UserService implements IUserServices {
  private static instance: UserService;

  public static getInstance(): UserService {
    if (!UserService.instance) {
      UserService.instance = new UserService();
    }
    return UserService.instance;
  }

  get = async (id: number): Promise<TUserEndpoint> => {
    try {
      const user = await User.findByPk(id);
      if (!user) {
        throw new Error("user not found");
      }
      user.password = "";
      return user;
    } catch (error) {
      throw error;
    }
  };

  getAll = async (): Promise<TUserEndpoint[]> => {
    try {
      const users = await User.findAll();
      if (users.length === 0) {
        throw new Error("users not found");
      }
      users.forEach((u) => (u.password = ""));
      return users;
    } catch (error) {
      throw error;
    }
  };

  post = async (data: TUser): Promise<TUserEndpoint> => {
    try {
      const { email, password, username } = data;

      const exists = await User.findOne({ where: { email } });
      if (exists) throw new Error("Email already exists");

      const existsUsername = await User.findOne({ where: { username } });
      if (existsUsername) throw new Error("Username already exists");

      const hashed = await bcrypt.hash(password, 10);
      data.password = hashed;
      const user = await User.create(data);
      user.password = "";
      return user;
    } catch (error) {
      throw error;
    }
  };

  patch = async (id: number, data: TUser): Promise<TUserEndpoint> => {
    try {
      const user = await User.findByPk(id);
      if (!user) {
        throw new Error("User not found");
      }

      if (data.password) {
        data.password = await bcrypt.hash(data.password, 10);
      }
      await user.update(data);
      return user;
    } catch (error) {
      throw error;
    }
  };

  delete = async (id: number): Promise<TUserEndpoint> => {
    try {
      const user = await User.findByPk(id);
      if (!user) {
        throw new Error("User not found");
      }
      await user.destroy();
      return user;
    } catch (error) {
      throw error;
    }
  };

  login = async (data: TLogin): Promise<TPayload> => {
    try {
      const { email, password } = data;
      const user = await User.findOne({ where: { email } });
      if (!user) {
        throw new Error("Invalid credentials");
      }

      const ok = await bcrypt.compare(password, user.password);
      if (!ok) {
        throw new Error("Invalid credentials");
      }

      const payload = { id: user.id, email: user.email, username: user.username, role: user.role };

      //Modificacion del token para hacerlo variable de entorno
      const token = jwt.sign(payload, config.JWT_ACCESS_SECRET as jwt.Secret,
        {expiresIn: config.JWT_EXPIRES_IN} as jwt.SignOptions
      );

      return { token, user };
    } catch (error) {
      throw {
        statusCode: 401,
        message: "Invalid credentials",
      };
    }
  };
}
