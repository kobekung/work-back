// RoleSeederService (role-seeder.service.ts)
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Repository } from 'sequelize-typescript';
import { ENUM_RoleName } from 'src/enum/role.enum';
import { IRole } from 'src/interface/models/role.model';

import { Role } from 'src/models/role.model';

@Injectable()
export class RoleSeederService {
  constructor(
    @InjectModel(Role)
    private readonly roleRepository: Repository<Role>,
  ) {}

  async seedRoles() {
    const roles = [
      {
        name: ENUM_RoleName.Owner,
        isEditPlan: true,
        isEditProject: true,
        isEditTask: true,
      },
      {
        name: ENUM_RoleName.Developer,
        isEditTask: true,
        isEditProject: false,
        isEditPlan: false,
      },
      {
        name: ENUM_RoleName.PM,
        isEditTask: true,
        isEditProject: true,
        isEditPlan: true,
      },
      {
        name: ENUM_RoleName.VIEWER,
        isEditTask: false,
        isEditProject: false,
        isEditPlan: false,
      },
      // Add more roles as needed
    ] as IRole[];

    for (const roleData of roles) {
      let role = await this.roleRepository.findOne({
        where: { name: roleData.name },
      });
      if (!role) {
        await this.roleRepository.create(roleData);
      }
    }
  }
}
