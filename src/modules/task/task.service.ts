import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Project } from 'src/models/project.model';
import { MemberService } from '../member/member.service';
import {
  MEMBER_PERISSION_ENUM,
  MEMBER_STATUS_ENUM,
} from 'src/enum/member.status';
import { Op } from 'sequelize';
import { ENUM_Role } from 'src/enum/role.enum';
import { Member } from 'src/models/member.model';
import { Plan } from 'src/models/plan.model';
import { IPlan } from 'src/interface/models/plan.model';
import { CreateTaskDto } from './dto/task.dto';
import { ITask } from 'src/interface/models/task.model';
import { Task } from 'src/models/task.model';

@Injectable()
export class TaskService {
  constructor(
    @InjectModel(Project) private repository: typeof Project,
    @InjectModel(Plan) private Planrepository: typeof Plan,
    @InjectModel(Member) private Memberrepository: typeof Member,
    @InjectModel(Task) private Taskrepository: typeof Task,
    private readonly memberService: MemberService,
  ) {}
  async getTask({
    planId,
  }: {
    planId: string;
    userId: number;
  }): Promise<ITask[]> {
    const Task = await this.Taskrepository.findAll({
      where: {
        planId,
      },
      order: [['id', 'ASC']],
    });
    return Task;
  }

  // async getPlanById(id: number): Promise<Plan> {
  //   return await this.Planrepository.findByPk(id);
  // }

  async createTask(Task: CreateTaskDto): Promise<Task> {
    try {
      const taskCreated = await this.Taskrepository.create(Task);
      return taskCreated;
    } catch (err) {
      console.log(err);
      throw new HttpException(err.response, err.response);
    }
  }

  async updateTask(
    id: number,
    task: CreateTaskDto,
  ): Promise<[affectedCount: number]> {
    try {
      const TaskUpdated = await this.Taskrepository.update(task, {
        where: { id },
      });
      return TaskUpdated;
    } catch (err) {
      const errorResponse =
        err.response && err.response.data
          ? err.response.data
          : err.message || 'Unknown error';
      const errorStatus =
        err.response && err.response.status ? err.response.status : 500;
      throw new HttpException(errorResponse, errorStatus);
    }
  }

  async deleteTask(id: number): Promise<number> {
    try {
      const TaskDeleted = await this.Taskrepository.destroy({
        where: { id: id },
      });
      return TaskDeleted;
    } catch (err) {
      throw new Error(err.message);
    }
  }

  // async checkpermissionDelete({
  //   userId,
  //   projectId,
  //   permissionStatus,
  // }: {
  //   userId: number;
  //   projectId: number;
  //   permissionStatus: MEMBER_PERISSION_ENUM;
  // }): Promise<boolean> {
  //   const whereClause: any = {
  //     userId: userId,
  //     projectId: projectId,
  //     status: MEMBER_STATUS_ENUM.ACTIVE,
  //   };

  //   if (permissionStatus == MEMBER_PERISSION_ENUM.IS_UPDATE) {
  //     whereClause.roleId = {
  //       [Op.or]: [ENUM_Role.Owner, ENUM_Role.PM],
  //     };
  //   }

  //   if (permissionStatus == MEMBER_PERISSION_ENUM.IS_DELETE) {
  //     whereClause.roleId = {
  //       [Op.or]: [ENUM_Role.Owner],
  //     };
  //   }
  //   const permission = await this.Memberrepository.findOne({
  //     where: whereClause,
  //   });

  //   return Boolean(permission);
  // }
}
