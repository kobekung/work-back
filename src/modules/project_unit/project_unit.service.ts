import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { IProjectUnit } from 'src/interface/models/project_unit.model';
import { ProjectUnit } from 'src/models/project_unit.model';


@Injectable()
export class ProjectUnitService {
  constructor(@InjectModel(ProjectUnit) private repository: typeof ProjectUnit) {}

  async getProjectUnit(token: string): Promise<IProjectUnit[]> {
    try {
      if (!token) {
        throw new HttpException('Token is required', HttpStatus.BAD_REQUEST);
      }
      const user = await this.repository.findOne({ where: { token } });
      if (!user) {
        throw new HttpException('User not found', HttpStatus.NOT_FOUND);
      }
      return await this.repository.findAll();
    } catch (err) {
      throw new HttpException(err.response, err.status);
    }
   
  }

  async getProjectUnitByProjectId(id: number , token:string): Promise<IProjectUnit> {
    
    try {
      if (!token) {
        throw new HttpException('Token is required', HttpStatus.BAD_REQUEST);
      }
      const user = await this.repository.findOne({ where: { token } });
      if (!user) {
        throw new HttpException('User not found', HttpStatus.NOT_FOUND);
      }
      return await this.repository.findByPk(id);
    } catch (err) {
      throw new HttpException(err.response, err.status);
    }
  }
}
