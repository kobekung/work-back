import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Req,
} from '@nestjs/common';
import { AddMemberDto } from './dto/member.dto';
import { MemberService } from './member.service';
import { Member } from 'src/models/member.model';
import { UserService } from '../user/services/user.service';
@Controller('/Member')
export class MemberController {
  constructor(
    private readonly MemberService: MemberService,
    private readonly userService: UserService,
  ) {}

  @Get('/:id')
  async getMemberByProjectID(
    @Param('id') id: number,
    @Req() request: Request,
  ): Promise<Member[]> {
    const token = request.headers['authorization'] as string;
    const user = await this.userService.getUserByToken(token);
    return await this.MemberService.getMemberByProjectID(id, user.id);
  }

  @Post()
  async createMember(@Body() member: AddMemberDto): Promise<String> {
    return await this.MemberService.createMember(member);
  }

  @Put('/:id')
  async updateProject(
    @Param('id') id: number,
    @Body() member: AddMemberDto,
  ): Promise<String> {
    return await this.MemberService.updateMember(id, member);
  }

  @Delete('/:id')
  async deleteProject(@Param('id') id: number): Promise<String> {
    return await this.MemberService.deleteMember(id);
  }
}
