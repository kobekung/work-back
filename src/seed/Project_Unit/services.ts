// RoleSeederService (role-seeder.service.ts)
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Repository } from 'sequelize-typescript';
import { PROJECT_UNIT_ENUM } from 'src/enum/project.unit.enum';
import { ENUM_RoleName } from 'src/enum/role.enum';
import { IProjectUnit } from 'src/interface/models/project_unit.model';
import { IRole } from 'src/interface/models/role.model';
import { ProjectUnit } from 'src/models/project_unit.model';

@Injectable()
export class ProjectUnitSeederService {
  constructor(
    @InjectModel(ProjectUnit)
    private readonly roleRepository: Repository<ProjectUnit>,
  ) {}

  async seed() {
    const ProjectUnits = [
      {
        name: PROJECT_UNIT_ENUM.ADMINISTRATIVE,
      },
      {
        name: PROJECT_UNIT_ENUM.BUFFET,
      },
      {
        name: PROJECT_UNIT_ENUM.PROGRAM1,
      },
      {
        name: PROJECT_UNIT_ENUM.PROGRAM2,
      },
    ] as IProjectUnit[];

    for (const ProjectUnitData of ProjectUnits) {
      let role = await this.roleRepository.findOne({
        where: { name: ProjectUnitData.name },
      });
      if (!role) {
        await this.roleRepository.create(ProjectUnitData);
      }
    }
  }
}
