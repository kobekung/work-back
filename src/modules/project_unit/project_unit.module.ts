import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Role } from 'src/models/role.model';
import { ProjectUnitController } from './project_unit.controller';
import { ProjectUnitService } from './project_unit.service';
import { ProjectUnit } from 'src/models/project_unit.model';

@Module({
  imports: [SequelizeModule.forFeature([ProjectUnit])],
controllers: [ProjectUnitController],
  providers: [ProjectUnitService],
})
export class ProjectUnitModule {}
