import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Member } from 'src/models/member.model';
import { MemberController } from './member.controller';
import { MemberService } from './member.service';
import { UserModule } from '../user/user.module';

@Module({
  imports: [SequelizeModule.forFeature([Member]),UserModule],
  controllers: [MemberController],
  providers: [MemberService],
  exports: [MemberService],
})
export class MemberModule {}
