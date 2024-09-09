import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Project } from 'src/models/project.model';
import { CreateProjectDto } from './dto/project.dto';
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
import { IDashboard } from 'src/interface/dashboard.interface';
import { ProjectLog } from 'src/models/project_log.model';

@Injectable()
export class ProjectService {
  constructor(
    @InjectModel(Project) private repository: typeof Project,
    @InjectModel(Member) private Memberrepository: typeof Member,
    @InjectModel(ProjectLog) private ProjectLogrepository: typeof ProjectLog,
    private readonly memberService: MemberService,
  ) {}

  async getProject({
    userId,
    pagination,
  }: {
    userId: number;
    pagination: IReqPagination;
  }): Promise<IPagination<IProjectTable>> {
    const projects = await this.repository.findAll({
      include: [
        {
          model: Member, // This should match the association name defined in your model
          where: {
            userId: userId,
            status: MEMBER_STATUS_ENUM.ACTIVE,
          },
        },
        {
          model: this.ProjectLogrepository,
          order: [['id', 'ASC']],
        },
      ],
      offset: pagination.page - 1,
      limit: pagination.limit,
    });

    const projectCount = await this.repository.count({
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
    const projectTablePromises = projects.map(async (e) => {
      const plans = e.plans || [];
      const planCount = plans.length;
      const taskCount = plans.reduce(
        (count, plan) => count + (plan.tasks?.length || 0),
        0,
      );

      const memberCount =
        await this.memberService.countMemberByProjectIdForTableProject(
          e.id,
          userId,
        );

      return {
        id: e.id,
        name: e.name,
        progress: e.percent,
        planCount: planCount,
        taskCount: taskCount,
        memberCount: memberCount,
      };
    });

    const projectTable = await Promise.all(projectTablePromises);

    return {
      data: projectTable,
      page: pagination.page,
      limit: pagination.limit,
      totalPage: Math.ceil(projectCount / pagination.limit),
      totalRow: projectCount,
    };
  }

  async getDashboard(userId: number): Promise<IDashboard> {
    const projects = await this.repository.findAll({
      include: [
        {
          model: Member,
          where: {
            userId: userId,
            status: MEMBER_STATUS_ENUM.ACTIVE,
          },
        },
      ],
    });

    const data = {
      total: projects.length,
      success: projects.filter((e) => e.percent === 100).length,
      pending: projects.filter((e) => e.percent === 0).length,
      onprogress: projects.filter((e) => e.percent > 0 && e.percent < 100)
        .length,
      projects: projects,
    } as IDashboard;
    return data;
  }

  async getProjectById(id: number): Promise<Project> {
    return await this.repository.findByPk(id);
  }

  async createProject(project: CreateProjectDto): Promise<Project> {
    const t = await this.repository.sequelize.transaction();
    try {
      const projectCreated = await this.repository.create(project, {
        transaction: t,
      });
      await t.commit();
      return projectCreated;
    } catch (err) {
      console.log(err);
      await t.rollback();
      throw new HttpException(err.response, err.response);
    }
  }

  async updateProject(
    id: number,
    project: CreateProjectDto,
  ): Promise<[affectedCount: number]> {
    const t = await this.repository.sequelize.transaction();
    try {
      const projectUpdated = await this.repository.update(project, {
        where: { id },
        transaction: t,
      });
      await t.commit();
      return projectUpdated;
    } catch (err) {
      await t.rollback();
      throw new HttpException(err.response.data, err.response.status);
    }
  }

  async deleteProject(
    id: number,
    userId: number,
    name: string,
  ): Promise<number> {
    const permission = await this.checkpermissionDelete({
      userId: userId,
      projectId: id,
      permissionStatus: MEMBER_PERISSION_ENUM.IS_UPDATE,
      name,
    });

    if (!permission) {
      throw new HttpException('ไม่มีสิทธ์', HttpStatus.FORBIDDEN);
    }
    // const getProjectName = await this.getProjectById(id);
    // if (getProjectName.name !== name) {
    //   throw new HttpException('ชื่อโปรเจคผิด', HttpStatus.FORBIDDEN);
    // }
    const t = await this.repository.sequelize.transaction();
    try {
      const projectDeleted = await this.repository.destroy({
        where: { id },
        transaction: t,
      });
      await t.commit();

      return projectDeleted;
    } catch (err) {
      await t.rollback();
      throw new Error(err);
    }
  }

  async checkpermissionDelete({
    userId,
    projectId,
    permissionStatus,
    name,
  }: {
    userId: number;
    projectId: number;
    permissionStatus: MEMBER_PERISSION_ENUM;
    name: string;
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

    const getProjectName = await this.getProjectById(projectId);
    if (getProjectName.name !== name) {
      throw new HttpException('ชื่อโปรเจคผิด', HttpStatus.FORBIDDEN);
    }
    const permission = await this.Memberrepository.findOne({
      where: whereClause,
    });

    return Boolean(permission);
  }
}
