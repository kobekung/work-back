import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Project } from 'src/models/project.model';
import { MemberModule } from '../member/member.module';
import { UserModule } from '../user/user.module';
import { Member } from 'src/models/member.model';
import { Plan } from 'src/models/plan.model';
import { Task } from 'src/models/task.model';
import { TaskService } from './task.service';
import { TaskController } from './task.controller';

@Module({
  imports: [SequelizeModule.forFeature([Project , Member, Plan , Task]), MemberModule,UserModule  , TaskModule],
  controllers: [TaskController],
  providers: [TaskService],
})
export class TaskModule {}

