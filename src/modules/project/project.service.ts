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

@Injectable()
export class ProjectService {
  constructor(
    @InjectModel(Project) private repository: typeof Project,
    @InjectModel(Member) private Memberrepository: typeof Member,
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
          association: 'members', // This should match the association name defined in your model
          where: {
            userId: userId,
            status: MEMBER_STATUS_ENUM.ACTIVE,
          },
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
    //to ProjectTable
    const projectTablePromises = await projects.map(async (e) => {
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
    const projectTable = await Promise.all(projectTablePromises);
    return {
      data: projectTable,
      page: pagination.page,
      limit: pagination.limit,
      totalPage: Math.ceil(projectCount / pagination.limit),
      totalRow: projectCount,
    };
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
