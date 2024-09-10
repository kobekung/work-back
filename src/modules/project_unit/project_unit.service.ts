import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { IProjectUnit } from 'src/interface/models/project_unit.model';
import { ProjectUnit } from 'src/models/project_unit.model';


@Injectable()
export class ProjectUnitService {
  constructor(@InjectModel(ProjectUnit) private repository: typeof ProjectUnit) {}

  async getProjectUnit(): Promise<IProjectUnit[]> {
    try {
     
      return await this.repository.findAll();
    } catch (err) {
      throw new HttpException(err.response, err.status);
    }
   
  }

  async getProjectUnitByProjectId(id: number ): Promise<IProjectUnit> {
    
    try {

      return await this.repository.findByPk(id);
    } catch (err) {
      throw new HttpException(err.response, err.status);
    }
  }
}
