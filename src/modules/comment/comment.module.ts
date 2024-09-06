import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Member } from 'src/models/member.model';
import { Task } from 'src/models/task.model';
import { User } from 'src/models/user.model';
import { CommentService } from './comment.service';
import { CommentController } from './comment.controller';

@Module({
  imports: [SequelizeModule.forFeature([Comment, Member, Task, User])],
  controllers: [CommentController],
  providers: [CommentService],
  exports: [CommentService],
})
export class CommentModule {}
