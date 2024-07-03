import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { ProjectService } from './project.service';
import { CreateProjectDto } from './dto/project.dto';
import { Project } from 'src/models/project.model';

@Controller('/project')
export class ProjectController {
    constructor(private readonly projectService: ProjectService) {}

    @Get()
    async getProject(): Promise<Project[]> {
        return await this.projectService.getProject();
    }

    @Get('/:id')
    async getProjectById(@Param('id') id: number): Promise<Project> {
        return await this.projectService.getProjectById(id);
    }

    @Post()
    async createProject(@Body() project: CreateProjectDto): Promise<Project> {
        return await this.projectService.createProject(project);
    }

    @Put('/:id')
    async updateProject(@Param('id') id: number, @Body() project: CreateProjectDto): Promise<[affectedCount: number]> {
        return await this.projectService.updateProject(id, project);
    }

    @Delete('/:id')
    async deleteProject(@Param('id') id: number): Promise<number> {
        return await this.projectService.deleteProject(id);
    }
}
