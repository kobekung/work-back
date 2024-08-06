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

import { CreatePlanDto } from './dto/plan.dto';
import { Plan } from 'src/models/plan.model';
import { PlanService } from './plan.service';
import { IPlan } from 'src/interface/models/plan.model';

@Controller('/plan')
export class PlanController {
  constructor(
    private readonly PlanService: PlanService,
    private readonly userService: UserService,
    private readonly memberService: MemberService,
  ) {}

  @Get(`/:id`)
  async getPlan(
    @Req() request: Request,
    @Param('id') id: string,
  ): Promise<IPlan[]> {
    const token = request.headers['authorization'] as string;
    const user = await this.userService.getUserByToken(token);
    // const member = await this.memberService.getMemberByUserId(user.id)
    const plan = await this.PlanService.getPlan({
      projectId : id,
      userId: user.id,
    });
    return plan;
  }

  // @Get('/:id')
  // async getPlanById(@Param('id') id: number): Promise<Plan> {
  //   return await this.PlanService.getPlanById(id);
  // }

  @Post()
  async createPlan(
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
  async updatePlan(
    @Param('id') id: number,
    @Body() project: CreatePlanDto,
  ): Promise<[affectedCount: number]> {
    return await this.PlanService.updatePlan(id, project);
  }

  @Delete('/:id')
  async deletePlan(
    @Param('id') id: number,
    @Req() request: Request,
    @Body() planId: number,
  ): Promise<number> {
    const token = request.headers['authorization'] as string;
    const user = await this.userService.getUserByToken(token);
    return await this.PlanService.deletePlan(id, user.id , planId);
  }
}
