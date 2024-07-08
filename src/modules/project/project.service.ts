import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Project } from 'src/models/project.model';
import { CreateProjectDto } from './dto/project.dto';

@Injectable()
export class ProjectService {
  constructor(@InjectModel(Project) private repository: typeof Project) {}

  async getProject(): Promise<Project[]> {
    return await this.repository.findAll();
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
      await t.rollback();
      throw new Error(err);
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
      throw new Error(err);
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
