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
import { MemberService } from '../member/member.service';

import { Plan } from 'src/models/plan.model';
import { IPlan } from 'src/interface/models/plan.model';
import { TaskService } from './task.service';
import { PlanService } from '../plan/plan.service';
import { CreateTaskDto } from './dto/task.dto';
import { ITask } from 'src/interface/models/task.model';
import { Task } from './../../models/task.model';

@Controller('/task')
export class TaskController {
  constructor(
    private readonly userService: UserService,
    private readonly memberService: MemberService,
    private readonly TaskService: TaskService,
  ) {}

  @Get(`/:id`)
  async getTask(
    @Req() request: Request,
    @Param('id') id: string,
  ): Promise<ITask[]> {
    const token = request.headers['authorization'] as string;
    const user = await this.userService.getUserByToken(token);
    // const member = await this.memberService.getMemberByUserId(user.id)
    const Task = await this.TaskService.getTask({
      planId : id,
      userId: user.id,
    });
    return Task;
  }

  // @Get('/:id')
  // async getPlanById(@Param('id') id: number): Promise<Plan> {
  //   return await this.PlanService.getPlanById(id);
  // }

  @Post()
  async createTask(
    @Body() Task: CreateTaskDto,
  ): Promise<Task> {
    const TaskCreated = await this.TaskService.createTask(Task);
    return TaskCreated;
  }

  @Put('/:id')
  async updateTask(
    @Param('id') id: number,
    @Body() task: CreateTaskDto,
  ): Promise<[affectedCount: number]> {
    return await this.TaskService.updateTask(id, task);
  }

  @Delete('/:id')
  async deleteTask(
    @Param('id') id: number,
  ): Promise<number> {
    return await this.TaskService.deleteTask(id);
  }
}
