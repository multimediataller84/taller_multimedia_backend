import { RoleService } from "../services/roleService.js";

export class RoleRepository {
  private static instance: RoleRepository;
  private readonly roleService = RoleService.getInstance();

  public static getInstance(): RoleRepository {
    if (!RoleRepository.instance) {
      RoleRepository.instance = new RoleRepository();
    }
    return RoleRepository.instance;
  }

  get = async (id: number) => {
    try {
      const role = await this.roleService.get(id);
      if (!role) {
        throw new Error("role not found");
      }
      return role;
    } catch (error) {
      throw error;
    }
  };

  getAll = async () => {
    try {
      const roles = await this.roleService.getAll();
      if (!roles) {
        throw new Error("roles not found");
      }
      return roles;
    } catch (error) {
      throw error;
    }
  };

  post = async (data: { name: string; description?: string }) => {
    try {
      const role = await this.roleService.post(data);
      if (!role) {
        throw new Error("error creating role");
      }
      return role;
    } catch (error) {
      throw error;
    }
  };

  patch = async (id: number, data: { name?: string; description?: string }) => {
    try {
      const role = await this.roleService.patch(id, data);
      if (!role) {
        throw new Error("error updating role");
      }
      return role;
    } catch (error) {
      throw error;
    }
  };

  delete = async (id: number) => {
    try {
      const role = await this.roleService.delete(id);
      if (!role) {
        throw new Error("error deleting role");
      }
      return role;
    } catch (error) {
      throw error;
    }
  };
}
