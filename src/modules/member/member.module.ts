import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Member } from 'src/models/member.model';
import { MemberController } from './member.controller';
import { MemberService } from './member.service';

@Module({
  imports: [SequelizeModule.forFeature([Member])],
  controllers: [MemberController],
  providers: [MemberService],
})
export class MemberModule {}
