import { Controller, Get, Param, Req } from '@nestjs/common';
import { IProjectUnit } from 'src/interface/models/project_unit.model';
import { ProjectUnitService } from './project_unit.service';

@Controller('/projectUnit')
export class ProjectUnitController {
  constructor(private readonly projectUnitService: ProjectUnitService) {}

  @Get()
  async getProjectUnit(): Promise<IProjectUnit[]> {
    return await this.projectUnitService.getProjectUnit();
  }

  @Get('/:id')
  async getProjectUnitByProjectId(
    @Param('id') id: number,
  ): Promise<IProjectUnit> {
    return await this.projectUnitService.getProjectUnitByProjectId(id);
  }
}
