import { HttpException, HttpStatus, Injectable, Req } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Comment } from 'src/models/comment.model';
import { AddCommentDto } from './dto/comment.dto';
import { Member } from 'src/models/member.model';
import { Task } from 'src/models/task.model';
import { User } from 'src/models/user.model';
import { Plan } from 'src/models/plan.model';
import { Project } from 'src/models/project.model';
import { ENUM_Role } from 'src/enum/role.enum';
import { Op } from 'sequelize';

@Injectable()
export class CommentService {
  constructor(
    @InjectModel(Comment) private repository: typeof Comment,
    @InjectModel(User) private userRepository: typeof User,
    @InjectModel(Member) private memberRepository: typeof Member,
    @InjectModel(Task) private taskRepository: typeof Task,
  ) {}

  async createComment(data: AddCommentDto, userId: number): Promise<Comment> {
    const t = await this.repository.sequelize.transaction();
    try {
      const findUser = await this.userRepository.findByPk(userId);
      if (!findUser) {
        throw new HttpException('User not found', HttpStatus.NOT_FOUND);
      }
      const findTask = await this.taskRepository.findOne({
        where: { id: data.taskId },
        include: [
          {
            model: Plan,
            include: [
              {
                model: Project,
                where: { userId },
              },
            ],
          },
        ],
      });
      if (!findTask) {
        throw new HttpException('Task not found', HttpStatus.NOT_FOUND);
      }
      const findMember = await this.memberRepository.findOne({
        where: { userId, projectId: findTask.plan.projectId },
      });
      if (!findMember) {
        throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);
      }
      const comment = await this.repository.create(data, { transaction: t });
      await t.commit();
      return comment;
    } catch (err) {
      await t.rollback();
      throw new HttpException(err.response, err.status);
    }
  }

  async DeleteComment(id: number, userId: number): Promise<number> {
    try {
      const comment = await this.repository.findOne({
        where: {
          id,
        },
        include: [
          {
            model: Task,
            include: [
              {
                model: Plan,
                include: [
                  {
                    model: Project,
                  },
                ],
              },
            ],
          },
        ],
      });
      if (!comment) {
        throw new HttpException('Comment not found', HttpStatus.NOT_FOUND);
      }
      const findMember = await this.memberRepository.findOne({
        where: {
          userId,
          projectId: comment.task.plan.projectId,
          //or Owner and PM
          roleId: {
            [Op.or]: [ENUM_Role.Owner, ENUM_Role.PM],
          },
        },
      });
      if (comment.userId !== userId && !findMember) {
        throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);
      }
      const deletedComment = await this.repository.destroy({
        where: {
          id,
        },
      });
      return deletedComment;
    } catch (err) {
      throw new HttpException(err.response, err.status);
    }
  }
}
