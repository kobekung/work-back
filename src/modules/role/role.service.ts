import { HttpException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Role } from 'src/models/role.model';
import { RoleDto } from './dto/role.dto';
import { Member } from 'src/models/member.model';

@Injectable()
export class RoleService {
  constructor(@InjectModel(Role) private repository: typeof Role) {}

  async getRole(): Promise<Role[]> {
    return await this.repository.findAll();
  }

  async getRoleById(id: number): Promise<Role> {
    return await this.repository.findByPk(id);
  }

  async getRoleByProjectId(id: number, userId: number): Promise<Role> {
    try {
      const role = await this.repository.findOne({
        include: [
          {
            model: Member,
            where: { projectId: id, userId: userId },
          },
        ],
      });
      if (!role) {
        throw new HttpException('Role not found', 404);
      }
      return role;
    } catch (err) {
      throw new HttpException(err, err.status);
    }
  }

  async createRole(role: RoleDto): Promise<Role> {
    const t = await this.repository.sequelize.transaction();
    try {
      const roleCreated = await this.repository.create(role, {
        transaction: t,
      });
      await t.commit();
      return roleCreated;
    } catch (err) {
      await t.rollback();
      throw new Error(err);
    }
  }

  async updateRole(
    id: number,
    role: RoleDto,
  ): Promise<[affectedCount: number]> {
    const t = await this.repository.sequelize.transaction();
    try {
      const roleUpdated = await this.repository.update(role, {
        where: { id },
        transaction: t,
      });
      await t.commit();
      return roleUpdated;
    } catch (err) {
      await t.rollback();
      throw new Error(err);
    }
  }

  async deleteRole(id: number): Promise<number> {
    const t = await this.repository.sequelize.transaction();
    try {
      const roleDeleted = await this.repository.destroy({
        where: { id },
        transaction: t,
      });
      await t.commit();
      return roleDeleted;
    } catch (err) {
      await t.rollback();
      throw new Error(err);
    }
  }
}
