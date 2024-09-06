import {
  Body,
  Controller,
  Delete,
  Param,
  Post,
  Put,
  Req,
} from '@nestjs/common';

import { CommentService } from './comment.service';
import { Member } from 'src/models/member.model';
import { UserService } from '../user/services/user.service';
import { AddCommentDto, UpdateCommentDto } from './dto/comment.dto';
import { Comment } from 'src/models/comment.model';

@Controller('/Comment')
export class CommentController {
  constructor(
    private readonly userService: UserService,
    private readonly commentService: CommentService,
  ) {}

  @Post()
  async createMember(
    @Body() data: AddCommentDto,
    @Req() request: Request,
  ): Promise<Comment> {
    const token = request.headers['authorization'] as string;
    const user = await this.userService.getUserByToken(token);
    const payload = {
      ...data,
      userId: user.id,
    };
    const newComment = await this.commentService.createComment(
      payload,
      user.id,
    );
    return newComment;

    return;
  }

  @Put('/:id')
  async updateProject(
    @Param('id') id: number,
    @Body() data: UpdateCommentDto,
    @Req() request: Request,
  ): Promise<[affectedCount: number]> {
    const token = request.headers['authorization'] as string;
    const user = await this.userService.getUserByToken(token);
    return;
  }

  @Delete('/:id')
  async deleteProject(
    @Param('id') id: number,
    @Req() request: Request,
  ): Promise<String> {
    const token = request.headers['authorization'] as string;
    const user = await this.userService.getUserByToken(token);
    return;
  }
}
