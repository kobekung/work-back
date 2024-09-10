import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';

import { ProjectUnitSeederService } from './services';
import { ProjectUnit } from 'src/models/project_unit.model';

@Module({
  imports: [SequelizeModule.forFeature([ProjectUnit])],
  providers: [ProjectUnitSeederService],
  exports: [ProjectUnitSeederService],
})
export class ProjectUnitSeedModule {}
