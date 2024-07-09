import { Body, Controller, Get, Param, Post, Req } from '@nestjs/common';
import { IProjectUnit } from 'src/interface/models/project_unit.model';
import { ProjectUnitService } from './project_unit.service';

@Controller('/projectUnit')
export class ProjectUnitController {
  constructor(private readonly projectUnitService: ProjectUnitService) {}

  @Get()
  async getProjectUnit(@Req() request: Request): Promise<IProjectUnit[]> {
    const token = request.headers['authorization'] as string;
    return await this.projectUnitService.getProjectUnit(token);
  }

  @Get('/:id')
  async getProjectUnitByProjectId(
    @Req() request: Request,
    @Param('id') id: number,
  ): Promise<IProjectUnit> {
    const token = request.headers['authorization'] as string;
    return await this.projectUnitService.getProjectUnitByProjectId(id , token);
  }
}
