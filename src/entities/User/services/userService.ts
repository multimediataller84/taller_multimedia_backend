import User from "../domain/models/UserModel.js";
import type { IUserServices } from "../domain/interfaces/IUserServices.js";
import type { TUserEndpoint } from "../domain/types/TUserEndpoint.js";
import type { TUser } from "../domain/types/TUser.js";
import type { TLogin } from "../domain/types/TLogin.js";
import bcrypt from "bcrypt";
import jwt, { type Secret, type SignOptions } from "jsonwebtoken";
import { config } from "../../../utilities/config.js";
import type { TPayload } from "../domain/types/TPayload.js";
import Role from "../../Role/domain/models/RoleModel.js";

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
      const user = await User.findByPk(id, {
        include: [{ model: Role, as: "role", attributes: ["id", "name"] }],
      });
      if (!user) {
        throw new Error("user not found");
      }
      console.log(user);
      user.password = "";
      return user;
    } catch (error) {
      throw error;
    }
  };

  getAll = async (): Promise<TUserEndpoint[]> => {
    try {
      const users = await User.findAll({
        include: [{ model: Role, as: "role", attributes: ["id", "name"] }],
      });
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
      const { password, username, role_id } = data;

      const existsUsername = await User.findOne({ where: { username } });
      if (existsUsername) throw new Error("Username already exists");

      const role_exist = await Role.findByPk(role_id);
      if (!role_exist) throw new Error("Role dont exists on role table");

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

      const updated = await User.findByPk(id, {
        include: [{ model: Role, as: "role", attributes: ["id", "name"] }],
      });

      return updated ?? user;
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
      const { username, password } = data;
      const user = await User.findOne({
        where: { username },
        include: [
          {
            model: Role,
            as: "role",
            attributes: ["id", "name"],
          },
        ],
      });

      console.log("[login] username:", username, "user found?", !!user);

      if (!user) {
        throw new Error("Invalid credentials");
      }

      const ok = await bcrypt.compare(password, user.password);

      console.log("[login] compare result:", ok);

      if (!ok) {
        throw new Error("Invalid credentials");
      }

      const payload = {
        id: user.id,
        email: user.email,
        username: user.username,
        role: user.role?.name,
      };

      console.log("[login] about to sign jwt", {
        hasSecret: !!config.JWT_ACCESS_SECRET,
        expiresIn: config.JWT_EXPIRES_IN,
      });

      const token = jwt.sign(
        payload,
        config.JWT_ACCESS_SECRET as Secret,
        { expiresIn: config.JWT_EXPIRES_IN } as SignOptions
      );

      return { token, user };
    } catch (error) {
      console.error("[login] error signing or processing jwt:", error);
      throw {
        statusCode: 401,
        message: "Invalid credentials",
      };
    }
  };
}
