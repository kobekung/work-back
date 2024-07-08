import { Module } from '@nestjs/common';
import { ProjectController } from './project.controller';
import { ProjectService } from './project.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { Project } from 'src/models/project.model';
import { MemberModule } from '../member/member.module';
import { UserModule } from '../user/user.module';

@Module({
  imports: [SequelizeModule.forFeature([Project]), MemberModule,UserModule],
  controllers: [ProjectController],
  providers: [ProjectService],
})
export class ProjectModule {}

