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
  AddMemberRequestDto,
  UpdateMemberDto,
  UpdateMemberStatusDto,
} from './dto/member.dto';
import { MemberService } from './member.service';
import { Member } from 'src/models/member.model';
import { UserService } from '../user/services/user.service';
import {
  MEMBER_PERISSION_ENUM,
  MEMBER_STATUS_ENUM,
} from 'src/enum/member.status';
import { IProfile } from 'src/interface/ldap.interface';
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

  @Get('name')
  async getMemberByName(
    @Req() request: Request,
    @Query() query: { name: string },
  ): Promise<IProfile[]> {
    const token = request.headers['authorization'] as string;
    return await this.MemberService.getMemberFromLdapByName(query.name, token);
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
  async createMember(
    @Body() member: AddMemberRequestDto,
    @Req() request: Request,
  ): Promise<Member> {
    const token = request.headers['authorization'] as string;
    const sender = await this.userService.getUserByToken(token);
    const user = await this.userService.getUserByIdp(member.idp, token);
    const payload = {
      userId: user.id,
      senderId: sender.id,
      roleId: member.roleId,
      projectId: member.projectId,
      status: MEMBER_STATUS_ENUM.PENDING,
    } as AddMemberDto;
    return await this.MemberService.createMember(
      payload,
      MEMBER_PERISSION_ENUM.IS_UPDATE,
    );
  }

  @Put('/:id')
  async updateProject(
    @Param('id') id: number,
    @Body() member: UpdateMemberDto,
    @Req() request: Request,
  ): Promise<[affectedCount: number]> {
    const token = request.headers['authorization'] as string;
    const user = await this.userService.getUserByToken(token);
    return await this.MemberService.updateMember(user.id, member);
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
  async deleteProject(
    @Param('id') id: number,
    @Req() request: Request,
  ): Promise<String> {
    const token = request.headers['authorization'] as string;
    const user = await this.userService.getUserByToken(token);
    return await this.MemberService.deleteMember(id, user.id);
  }
}
