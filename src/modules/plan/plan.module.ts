import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Project } from 'src/models/project.model';
import { MemberModule } from '../member/member.module';
import { UserModule } from '../user/user.module';
import { Member } from 'src/models/member.model';
import { PlanController } from './plan.controller';
import { PlanService } from './plan.service';

@Module({
  imports: [SequelizeModule.forFeature([Project , Member]), MemberModule,UserModule  ],
  controllers: [PlanController],
  providers: [PlanService],
})
export class PlanModule {}

