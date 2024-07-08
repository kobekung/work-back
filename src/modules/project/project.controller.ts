import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Req,
} from '@nestjs/common';
import { ProjectService } from './project.service';
import { CreateProjectDto } from './dto/project.dto';
import { Project } from 'src/models/project.model';
import { UserService } from '../user/services/user.service';
import { ENUM_Role } from 'src/enum/role.enum';
import { AddMemberDto } from '../member/dto/member.dto';
import { MEMBER_STATUS_ENUM } from 'src/enum/member.status';
import { MemberService } from '../member/member.service';

@Controller('/project')
export class ProjectController {
  constructor(
    private readonly projectService: ProjectService,
    private readonly userService: UserService,
    private readonly memberService: MemberService,
  ) {}

  @Get()
  async getProject(): Promise<Project[]> {
    return await this.projectService.getProject();
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
    await this.memberService.createMember(memberDetails);
    return projectCreated;
  }

  @Put('/:id')
  async updateProject(
    @Param('id') id: number,
    @Body() project: CreateProjectDto,
  ): Promise<[affectedCount: number]> {
    return await this.projectService.updateProject(id, project);
  }

  @Delete('/:id')
  async deleteProject(@Param('id') id: number): Promise<number> {
    return await this.projectService.deleteProject(id);
  }
}
