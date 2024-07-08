import {
  Controller,
  Get,
  Param,
} from '@nestjs/common';
import { IProjectUnit } from 'src/interface/models/project_unit.model';
import { ProjectUnitService } from './project_unit.service';

@Controller('/projectUnit')
export class ProjectUnitController {
  constructor(private readonly ProjectUnitService: ProjectUnitService) {}

  @Get()
  async getProjectUnit(): Promise<IProjectUnit[]> {
    return await this.ProjectUnitService.getProjectUnit();
  }

  @Get('/:id')
  async getProjectUnitByProjectId(@Param('id') id: number): Promise<IProjectUnit> {
    return await this.ProjectUnitService.getProjectUnitByProjectId(id);
  }

}
