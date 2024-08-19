import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Project } from 'src/models/project.model';
import { MemberModule } from '../member/member.module';
import { UserModule } from '../user/user.module';
import { Member } from 'src/models/member.model';
import { PlanController } from './plan.controller';
import { PlanService } from './plan.service';
import { Plan } from 'src/models/plan.model';
import { Task } from 'src/models/task.model';

@Module({
  imports: [SequelizeModule.forFeature([Project , Member, Plan , Task]), MemberModule,UserModule  , PlanModule],
  controllers: [PlanController],
  providers: [PlanService],
})
export class PlanModule {}

