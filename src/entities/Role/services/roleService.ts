import Role from "../domain/models/RoleModel.js";

export class RoleService {
  private static instance: RoleService;

  public static getInstance(): RoleService {
    if (!RoleService.instance) {
      RoleService.instance = new RoleService();
    }
    return RoleService.instance;
  }

  get = async (id: number) => {
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

  getAll = async () => {
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

  post = async (data: { name: string; description?: string }) => {
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

  patch = async (id: number, data: { name?: string; description?: string }) => {
    try {
      const role = await Role.findByPk(id);
      if (!role) throw new Error("role not found");

      if (data.name && data.name !== role.name) {
        const exists = await Role.findOne({ where: { name: data.name } });
        if (exists) throw new Error("name already exists");
      }

      await role.update({
        ...(data.name !== undefined ? { name: data.name } : {}),
        ...(data.description !== undefined ? { description: data.description } : {})
      });

      return role;
    } catch (error) {
      throw error;
    }
  };

  delete = async (id: number) => {
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
