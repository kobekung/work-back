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
import { ProjectService } from '../project/project.service';
import { CreatePlanDto } from './dto/plan.dto';
import { Plan } from 'src/models/plan.model';
import { PlanService } from './plan.service';

@Controller('/plan')
export class PlanController {
  constructor(
    private readonly PlanService: PlanService,
    private readonly userService: UserService,
    private readonly memberService: MemberService,
  ) {}

  @Get()
  async getProject(
    @Req() request: Request,
    @Query() pagination: IReqPagination,
  ): Promise<IPagination<IProjectTable>> {
    const token = request.headers['authorization'] as string;
    const user = await this.userService.getUserByToken(token);
    const plan = await this.PlanService.getPlan({
      userId: user.id,
      pagination: pagination,
    });
    return plan;
  }

  @Get('/:id')
  async getProjectById(@Param('id') id: number): Promise<Plan> {
    return await this.PlanService.getPlanById(id);
  }

  @Post()
  async createProject(
    @Body() project: CreatePlanDto,
    @Req() request: Request,
  ): Promise<Plan> {
    const token = request.headers['authorization'] as string;
    const user = await this.userService.getUserByToken(token);
    const planCreated = await this.PlanService.createPlan(project);
    const memberDetails = {
      projectId: planCreated.id,
      userId: user.id,
      roleId: ENUM_Role.Owner,
      status: MEMBER_STATUS_ENUM.ACTIVE,
    } as AddMemberDto;
    await this.memberService.createMember(
      memberDetails,
      MEMBER_PERISSION_ENUM.IS_OWNER,
    );
    return planCreated;
  }

  @Put('/:id')
  async updateProject(
    @Param('id') id: number,
    @Body() project: CreatePlanDto,
  ): Promise<[affectedCount: number]> {
    return await this.PlanService.updatePlan(id, project);
  }

  @Delete('/:id')
  async deleteProject(
    @Param('id') id: number,
    @Req() request: Request,
  ): Promise<number> {
    const token = request.headers['authorization'] as string;
    const user = await this.userService.getUserByToken(token);
    return await this.PlanService.deletePlan(id, user.id);
  }
}
