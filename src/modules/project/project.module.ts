import { Module } from '@nestjs/common';
import { ProjectController } from './project.controller';
import { ProjectService } from './project.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { Project } from 'src/models/project.model';
import { MemberModule } from '../member/member.module';
import { UserModule } from '../user/user.module';
import { Member } from 'src/models/member.model';
import { ProjectLog } from 'src/models/project_log.model';
import { ProjectLogModule } from '../project_log/project_log.module';

@Module({
  imports: [SequelizeModule.forFeature([Project , Member , ProjectLog]), MemberModule,UserModule,ProjectLogModule  ],
  controllers: [ProjectController],
  providers: [ProjectService],
})
export class ProjectModule {}

