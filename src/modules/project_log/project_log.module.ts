import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { ProjectLog } from 'src/models/project_log.model';
import { ProjectLogController } from './project_log.controller';
import { ProjectLogService } from './project_log.service';

@Module({
  imports: [SequelizeModule.forFeature([ProjectLog])],
  controllers: [ProjectLogController],
  providers: [ProjectLogService],
  exports: [ProjectLogService],
})
export class ProjectLogModule {}
