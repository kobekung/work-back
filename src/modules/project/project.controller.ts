import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  Req,
} from '@nestjs/common';
import { ProjectService } from './project.service';
import { CreateProjectDto } from './dto/project.dto';
import { Project } from 'src/models/project.model';
import { UserService } from '../user/services/user.service';
import { ENUM_Role } from 'src/enum/role.enum';
import { AddMemberDto } from '../member/dto/member.dto';
import {
  MEMBER_PERISSION_ENUM,
  MEMBER_STATUS_ENUM,
} from 'src/enum/member.status';
import { MemberService } from '../member/member.service';
import { IProjectTable } from 'src/interface/models/project.model';
import {
  IPagination,
  IReqPagination,
} from 'src/interface/pagination.interface';
import { ProjectLogService } from '../project_log/project_log.service';

@Controller('/project')
export class ProjectController {
  constructor(
    private readonly projectService: ProjectService,
    private readonly userService: UserService,
    private readonly memberService: MemberService,
    private readonly projectLogService: ProjectLogService,
  ) {}

  @Get()
  async getProject(
    @Req() request: Request,
    @Query() pagination: IReqPagination,
  ): Promise<IPagination<IProjectTable>> {
    const token = request.headers['authorization'] as string;
    const user = await this.userService.getUserByToken(token);
    const project = await this.projectService.getProject({
      userId: user.id,
      pagination: pagination,
    });
    return project;
  }

  @Get()
  async getDashboard(
    @Req() request: Request,
    @Query() pagination: IReqPagination,
  ): Promise<IPagination<IProjectTable>> {
    const token = request.headers['authorization'] as string;
    const user = await this.userService.getUserByToken(token);
    const project = await this.projectService.getProject({
      userId: user.id,
      pagination: pagination,
    });
    return project;
  }

  @Get('/:id')
  async getProjectById(@Param('id') id: number): Promise<Project> {
    return await this.projectService.getProjectById(id);
  }

  @Post()
  async createProject(
    @Body() project: CreateProjectDto,
    @Req() request: Request,
  ): Promise<Project> {
    const token = request.headers['authorization'] as string;
    const user = await this.userService.getUserByToken(token);
    const projectCreated = await this.projectService.createProject(project);
    const memberDetails = {
      projectId: projectCreated.id,
      userId: user.id,
      roleId: ENUM_Role.Owner,
      status: MEMBER_STATUS_ENUM.ACTIVE,
    } as AddMemberDto;
    await this.memberService.createMember(
      memberDetails,
      MEMBER_PERISSION_ENUM.IS_OWNER,
    );
    const project_log = {
      name: project.name,
      startDate: project.startDate,
      endDate: project.endDate,
      percent: project.percent,
      projectId: projectCreated.id,
    };
    await this.projectLogService.createProjectLog(project_log);
    return projectCreated;
  }

  @Put('/:id')
  async updateProject(
    @Param('id') id: number,
    @Body() project: CreateProjectDto,
  ): Promise<[affectedCount: number]> {
    const updateProject = this.projectService.updateProject(id, project);
    const project_log = {
      name: project.name,
      startDate: project.startDate,
      endDate: project.endDate,
      percent: project.percent,
      projectId: id,
    };
    await this.projectLogService.createProjectLog(project_log);
    return updateProject;
  }

  @Delete('/:id')
  async deleteProject(
    @Param('id') id: number,
    @Req() request: Request,
    @Body('name') name: string,
  ): Promise<number> {
    const token = request.headers['authorization'] as string;
    const user = await this.userService.getUserByToken(token);
    return await this.projectService.deleteProject(id, user.id, name);
  }
}
