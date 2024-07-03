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

  async createProject(project: CreateProjectDto) {
    const t = await this.repository.sequelize.transaction();
    try {
      await this.repository.create(project, {
        transaction: t,
      });
      await t.commit();
      return 'Project Created Successfully';
    } catch (err) {
      await t.rollback();
      throw new Error(err);
    }
  }

  async updateProject(id: number, project: CreateProjectDto) {
    const t = await this.repository.sequelize.transaction();
    try {
      await this.repository.update(project, { where: { id } });
      await t.commit();
      return 'Project Updated Successfully';
    } catch (err) {
      await t.rollback();
      throw new Error(err);
    }
  }

  async deleteProject(id: number): Promise<String> {
    const t = await this.repository.sequelize.transaction();
    try {
      await this.repository.destroy({
        where: { id },
      });
      await t.commit();
      return 'Project Deleted Successfully';
    } catch (err) {
      await t.rollback();
      throw new Error(err);
    }
  }
}
