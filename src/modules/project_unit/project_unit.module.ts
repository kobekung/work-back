import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Role } from 'src/models/role.model';
import { ProjectUnitController } from './project_unit.controller';
import { ProjectUnitService } from './project_unit.service';

@Module({
  imports: [SequelizeModule.forFeature([Role])],
  controllers: [ProjectUnitController],
  providers: [ProjectUnitService],
})
export class RoleModule {}
