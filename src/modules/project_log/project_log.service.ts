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
    try {
      const projectCreated = await this.repository.create(project_log);
      return projectCreated;
    } catch (err) {
      console.log(err);
      throw new HttpException(err.response, err.response);
    }
  }
  async deleteProjectLog(
    id: number,
  ): Promise<number> {
    try {
      const projectDeleted = await this.repository.destroy({
        where: { id },
      });

      return projectDeleted;
    } catch (err) {
      throw new Error(err);
    }
  }
}
