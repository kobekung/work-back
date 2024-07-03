import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Role } from 'src/models/role.model';
import { RoleDto } from './dto/role.dto';

@Injectable()
export class RoleService {
  constructor(@InjectModel(Role) private repository: typeof Role) {}

  async getRole(): Promise<Role[]> {
    return await this.repository.findAll();
  }

  async getRoleById(id: number): Promise<Role> {
    return await this.repository.findByPk(id);
  }

  async createRole(role: RoleDto) {
    const t = await this.repository.sequelize.transaction();
    try {
      await this.repository.create(role, {
        transaction: t,
      });
      await t.commit();
      return 'Role Created Successfully';
    } catch (err) {
      await t.rollback();
      throw new Error(err);
    }
  }

  async updateRole(id: number, role: RoleDto) {
    const t = await this.repository.sequelize.transaction();
    try {
      await this.repository.update(role, { where: { id }, transaction: t });
      await t.commit();
      return 'Role Updated Successfully';
    } catch (err) {
      await t.rollback();
      throw new Error(err);
    }
  }

  async deleteRole(id: number): Promise<String> {
    const t = await this.repository.sequelize.transaction();
    try {
      await this.repository.destroy({
        where: { id },
        transaction: t,
      });
      await t.commit();
      return 'Role Deleted Successfully';
    } catch (err) {
      await t.rollback();
      throw new Error(err);
    }
  }
}
