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
import { CreatePlanDto } from './dto/plan.dto';
import { IPlan } from 'src/interface/models/plan.model';
import { Task } from 'src/models/task.model';
import { Worker } from 'src/models/worker.model';
import { User } from 'src/models/user.model';

@Injectable()
export class PlanService {
  constructor(
    @InjectModel(Project) private repository: typeof Project,
    @InjectModel(Plan) private Planrepository: typeof Plan,
    @InjectModel(Member) private Memberrepository: typeof Member,
    @InjectModel(Task) private Taskrepository: typeof Task,
    @InjectModel(Worker) private Workerrepository: typeof Worker,
    @InjectModel(User) private Userrepository: typeof User,
    private readonly memberService: MemberService,
  ) {}
  async getPlan({
    projectId,
    userId,
  }: {
    projectId: string;
    userId: number;
  }): Promise<IPlan[]> {
    const plans = await this.Planrepository.findAll({
      where: {
        projectId,
      },
      include: [
        {
          model: this.Taskrepository,
          as: 'tasks',
          include: [
            {
              model: this.Workerrepository,
              as: 'worker',
              include: [
                {
                  model: this.Userrepository,
                  as: 'user',
                  order: [['id', 'ASC']],
                },
              ],
              order: [['id', 'ASC']],
            },
          ],
          order: [['id', 'ASC']],
        },
      ],
      order: [['id', 'ASC']],
    });
    return plans;
  }

  async getPlanById(id: number): Promise<Plan> {
    return await this.Planrepository.findByPk(id);
  }

  async createPlan(plan: CreatePlanDto): Promise<Plan> {
    const t = await this.Planrepository.sequelize.transaction();
    try {
      const planCreated = await this.Planrepository.create(plan, {
        transaction: t,
      });
      await t.commit();
      return planCreated;
    } catch (err) {
      console.log(err);
      await t.rollback();
      throw new HttpException(err.response, err.response);
    }
  }

  async updatePlan(
    id: number,
    plan: CreatePlanDto,
  ): Promise<[affectedCount: number]> {
    const t = await this.Planrepository.sequelize.transaction();
    try {
      const planUpdated = await this.Planrepository.update(plan, {
        where: { id },
        transaction: t,
      });
      await t.commit();
      return planUpdated;
    } catch (err) {
      await t.rollback();
      throw new HttpException(err.response.data, err.response.status);
    }
  }

  async deletePlan(id: number): Promise<number> {
    const t = await this.Planrepository.sequelize.transaction();
    try {
      const planDeleted = await this.Planrepository.destroy({
        where: { id: id },
        transaction: t,
      });
      await t.commit();
      return planDeleted;
    } catch (err) {
      await t.rollback();
      throw new Error(err.message);
    }
  }

  async checkpermissionDelete({
    userId,
    projectId,
    permissionStatus,
  }: {
    userId: number;
    projectId: number;
    permissionStatus: MEMBER_PERISSION_ENUM;
  }): Promise<boolean> {
    const whereClause: any = {
      userId: userId,
      projectId: projectId,
      status: MEMBER_STATUS_ENUM.ACTIVE,
    };

    if (permissionStatus == MEMBER_PERISSION_ENUM.IS_UPDATE) {
      whereClause.roleId = {
        [Op.or]: [ENUM_Role.Owner, ENUM_Role.PM],
      };
    }

    if (permissionStatus == MEMBER_PERISSION_ENUM.IS_DELETE) {
      whereClause.roleId = {
        [Op.or]: [ENUM_Role.Owner],
      };
    }
    const permission = await this.Memberrepository.findOne({
      where: whereClause,
    });

    return Boolean(permission);
  }
}
