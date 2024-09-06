import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Member } from 'src/models/member.model';
import { Task } from 'src/models/task.model';
import { User } from 'src/models/user.model';
import { CommentService } from './comment.service';
import { CommentController } from './comment.controller';
import { Comment } from 'src/models/comment.model';
import { UserModule } from '../user/user.module';

@Module({
  imports: [
    SequelizeModule.forFeature([Comment, Member, Task, User]),
    UserModule,
  ],
  controllers: [CommentController],
  providers: [CommentService],
  exports: [CommentService],
})
export class CommentModule {}
