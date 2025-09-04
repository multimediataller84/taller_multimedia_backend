import type { IRoleServices } from "../domain/interfaces/IRoleServices.js";
import Role from "../domain/models/RoleModel.js";
import type { TRole } from "../domain/types/TRole.js";
import type { TRoleEndpoint } from "../domain/types/TRoleEndpoint.js";

export class RoleService implements IRoleServices{
  private static instance: RoleService;

  public static getInstance(): RoleService {
    if (!RoleService.instance) {
      RoleService.instance = new RoleService();
    }
    return RoleService.instance;
  }

  get = async (id: number): Promise<TRoleEndpoint> => {
    try {
      const role = await Role.findByPk(id);
      if (!role) {
        throw new Error("role not found");
      }
      return role;
    } catch (error) {
      throw error;
    }
  };

  getAll = async (): Promise<TRoleEndpoint[]> => {
    try {
      const roles = await Role.findAll();
      if (roles.length === 0) {
        throw new Error("roles not found");
      }
      return roles;
    } catch (error) {
      throw error;
    }
  };

  post = async (data: TRole): Promise<TRoleEndpoint> => {
    try {
      const { name } = data;
      if (!name) throw new Error("name is required");

      const exists = await Role.findOne({ where: { name } });
      if (exists) throw new Error("name already exists");

      const role = await Role.create({
      name,
      ...(data.description !== undefined ? { description: data.description } : {})
      });
      
      return role;
    } catch (error) {
      throw error;
    }
  };

  patch = async (id: number, data: TRole): Promise<TRoleEndpoint> => {
    try {
      const role = await Role.findByPk(id);
      if (!role) throw new Error("role not found");

      if (data.name && data.name !== role.name) {
        const exists = await Role.findOne({ where: { name: data.name } });
        if (exists) throw new Error("name already exists");
      }

      await role.update(data);

      return role;
    } catch (error) {
      throw error;
    }
  };

  delete = async (id: number): Promise<TRoleEndpoint> => {
    try {
      const role = await Role.findByPk(id);
      if (!role) throw new Error("role not found");

      await role.destroy();
      return role; // igual que userService: devolvemos el registro eliminado
    } catch (error) {
      throw error;
    }
  };
}
