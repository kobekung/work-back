import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Project } from 'src/models/project.model';
import { IProjectTable } from 'src/interface/models/project.model';
import { MemberService } from '../member/member.service';
import {
  MEMBER_PERISSION_ENUM,
  MEMBER_STATUS_ENUM,
} from 'src/enum/member.status';
import {
  IPagination,
  IReqPagination,
} from 'src/interface/pagination.interface';
import { Op } from 'sequelize';
import { ENUM_Role } from 'src/enum/role.enum';
import { Member } from 'src/models/member.model';
import { Plan } from 'src/models/plan.model';
import { CreatePlanDto } from './dto/plan.dto';

@Injectable()
export class PlanService {
  constructor(
    @InjectModel(Project) private repository: typeof Project,
    @InjectModel(Plan) private Planrepository: typeof Plan,
    @InjectModel(Member) private Memberrepository: typeof Member,
    private readonly memberService: MemberService,
  ) {}

  async getPlan({
    projectId,
    userId,
    pagination,
  }: {
    projectId : string;
    userId: number;
    pagination: IReqPagination;
  }): Promise<IPagination<IProjectTable>> {
    const plan = await this.Planrepository.findAll({
      include: [
        {
          association: 'members',
          where: {
            projectId,
            userId: userId,
            status: MEMBER_STATUS_ENUM.ACTIVE,
          },
        },
      ],
      offset: pagination.page - 1,
      limit: pagination.limit,
    });

    const planCount = await this.Planrepository.count({
      include: [
        {
          association: 'members',
          where: {
            userId: userId,
            status: MEMBER_STATUS_ENUM.ACTIVE,
          },
        },
      ],
    });
    //to ProjectTable
    const PlanTablePromises = await plan.map(async (e) => {
      const memberCount =
        await this.memberService.countMemberByProjectIdForTableProject(
          e.id,
          userId,
        );
      return {
        id: e.id,
        name: e.name,
        progress: Math.floor(Math.random() * 101),
        planCount: Math.floor(Math.random() * 3),
        taskCount: Math.floor(Math.random() * 6),
        memberCount: memberCount,
      };
    });
    const planTable = await Promise.all(PlanTablePromises);
    return {
      data: planTable,
      page: pagination.page,
      limit: pagination.limit,
      totalPage: Math.ceil(planCount / pagination.limit),
      totalRow: planCount,
    };
  }

  async getPlanById(id: number): Promise<Plan> {
    return await this.Planrepository.findByPk(id);
  }

  async createPlan(plan: CreatePlanDto): Promise<Plan> {
    const t = await this.repository.sequelize.transaction();
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

  async deletePlan(
    id: number,
    userId: number,
  ): Promise<number> {
    const permission = await this.checkpermissionDelete({
      userId: userId,
      projectId: id,
      permissionStatus: MEMBER_PERISSION_ENUM.IS_UPDATE,
    });

    if (!permission) {
      throw new HttpException('ไม่มีสิทธ์', HttpStatus.FORBIDDEN);
    }
    // const getProjectName = await this.getProjectById(id);
    // if (getProjectName.name !== name) {
    //   throw new HttpException('ชื่อโปรเจคผิด', HttpStatus.FORBIDDEN);
    // }
    const t = await this.Planrepository.sequelize.transaction();
    try {
      const planDeleted = await this.Planrepository.destroy({
        where: { id },
        transaction: t,
      });
      await t.commit();

      return planDeleted;
    } catch (err) {
      await t.rollback();
      throw new Error(err);
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
    let whereClause: any = {
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
