import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { CreateProjectLogDto } from './dto/project_log.dto';
import { ProjectLog } from 'src/models/project_log.model';

@Injectable()
export class ProjectLogService {
  constructor(
    @InjectModel(ProjectLog) private repository: typeof ProjectLog,
  ) {}

  async getProjectLogByProjectId(id: number): Promise<ProjectLog> {
    return await this.repository.findByPk(id);
  }

  async createProjectLog(project_log: CreateProjectLogDto){
    const t = await this.repository.sequelize.transaction();
    try {
      const projectCreated = await this.repository.create(project_log, {
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
  async deleteProjectLog(
    id: number,
  ): Promise<number> {
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
