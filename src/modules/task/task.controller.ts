import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Patch,
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

import { Plan } from 'src/models/plan.model';
import { IPlan } from 'src/interface/models/plan.model';
import { TaskService } from './task.service';
import { PlanService } from '../plan/plan.service';
import { CreateTaskDto } from './dto/task.dto';

@Controller('/task')
export class TaskController {
  constructor(
    private readonly PlanService: PlanService,
    private readonly userService: UserService,
    private readonly memberService: MemberService,
    private readonly TaskService: TaskService,
  ) {}

  @Get(`/:id`)
  async getTask(
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
  async createTask(
    @Body() project: CreateTaskDto,
  ): Promise<Plan> {
    const planCreated = await this.PlanService.createPlan(project);
    return planCreated;
  }

  @Put('/:id')
  async updateTask(
    @Param('id') id: number,
    @Body() project: CreateTaskDto,
  ): Promise<[affectedCount: number]> {
    return await this.PlanService.updatePlan(id, project);
  }

  @Delete('/:id')
  async deleteTask(
    @Param('id') id: number,
  ): Promise<number> {
    return await this.PlanService.deletePlan(id);
  }
}
