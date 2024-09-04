import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
} from '@nestjs/common';
import { CreateProjectLogDto } from './dto/project_log.dto';
import { ProjectLogService } from './project_log.service';
import { ProjectLog } from 'src/models/project_log.model';
@Controller('/project')
export class ProjectController {
  constructor(
    private readonly projectLogService: ProjectLogService,
  ) {}

  @Get('/:id')
  async getProjectById(@Param('id') id: number): Promise<ProjectLog> {
    return await this.projectLogService.getProjectLogByProjectId(id);
  }

  @Post()
  async createProject(
    @Body() project: CreateProjectLogDto,
  ): Promise<ProjectLog> {
    const projectLogCreated = await this.projectLogService.createProjectLog(project);
    return projectLogCreated;
  }

  @Delete('/:id')
  async deleteProjectLog(@Param('id') id: number): Promise<number> {
    return await this.projectLogService.deleteProjectLog(id);
  }
}
