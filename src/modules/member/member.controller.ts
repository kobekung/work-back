import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  Req,
} from '@nestjs/common';
import {
  AddMemberDto,
  UpdateMemberDto,
  UpdateMemberStatusDto,
} from './dto/member.dto';
import { MemberService } from './member.service';
import { Member } from 'src/models/member.model';
import { UserService } from '../user/services/user.service';
import { MEMBER_STATUS_ENUM } from 'src/enum/member.status';
@Controller('/Member')
export class MemberController {
  constructor(
    private readonly MemberService: MemberService,
    private readonly userService: UserService,
  ) {}

  @Get()
  async getMember(
    @Req() request: Request,
    @Query() query?: { status: MEMBER_STATUS_ENUM },
  ): Promise<Member[]> {
    const token = request.headers['authorization'] as string;
    const user = await this.userService.getUserByToken(token);
    return await this.MemberService.getMemberByUserId(user.id, query.status);
  }

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
  async createMember(@Body() member: AddMemberDto): Promise<Member> {
    return await this.MemberService.createMember(member);
  }

  @Put('/:id')
  async updateProject(
    @Param('id') id: number,
    @Body() member: UpdateMemberDto,
  ): Promise<[affectedCount: number]> {
    return await this.MemberService.updateMember(id, member);
  }

  @Put('updateStatus/:id')
  async updateMemberStatus(
    @Param('id') id: number,
    @Body() member: { status: MEMBER_STATUS_ENUM },
    @Req() request: Request,
  ): Promise<[affectedCount: number]> {
    const token = request.headers['authorization'] as string;
    const user = await this.userService.getUserByToken(token);
    return await this.MemberService.updateMemberStatus({
      id,
      status: member.status,
      userId: user.id,
    });
  }

  @Delete('/:id')
  async deleteProject(@Param('id') id: number): Promise<String> {
    return await this.MemberService.deleteMember(id);
  }
}
