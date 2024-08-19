import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Member } from 'src/models/member.model';
import { UserModule } from '../user/user.module';
import { WorkerController } from './worker.controller';
import { WorkerService } from './worker.service';
import { MemberModule } from '../member/member.module';
import { Worker } from 'src/models/worker.model';

@Module({
  imports: [
    SequelizeModule.forFeature([Member , Worker]),
    UserModule,MemberModule, WorkerModule
  ],
  controllers: [WorkerController],
  providers: [WorkerService],
  exports: [WorkerService],
})
export class WorkerModule {}
