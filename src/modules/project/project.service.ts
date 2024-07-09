import { HttpException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Project } from 'src/models/project.model';
import { CreateProjectDto } from './dto/project.dto';
import { IProjectTable } from 'src/interface/models/project.model';
import { MemberService } from '../member/member.service';

@Injectable()
export class ProjectService {
  constructor(
    @InjectModel(Project) private repository: typeof Project,
    private readonly memberService: MemberService,
  ) {}

  async getProject(projectId: number[], userId): Promise<IProjectTable[]> {
    if (projectId.length > 0) {
      const projects = await this.repository.findAll({
        where: { id: projectId },
      });
      //to ProjectTable
      const projectTablePromises = await projects.map(async (e) => {
        const memberCount = await this.memberService.getMemberByProjectID(
          userId,
          e.id,
        );
        return {
          id: e.id,
          name: e.name,
          process: 100,
          planCount: 2,
          taskCount: 5,
          memberCount: memberCount.length,
        };
      });
      const projectTable = await Promise.all(projectTablePromises);
      return projectTable;
    }
    return [];
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

  async deleteProject(id: number): Promise<number> {
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
}
