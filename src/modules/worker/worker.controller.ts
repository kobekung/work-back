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
import { Member } from 'src/models/member.model';
import { UserService } from '../user/services/user.service';
import {
  MEMBER_PERISSION_ENUM,
  MEMBER_STATUS_ENUM,
} from 'src/enum/member.status';
import { IProfile } from 'src/interface/ldap.interface';
import { WorkerService } from './worker.service';
import { Worker } from 'src/models/worker.model';
import { IWorker } from 'src/interface/models/worker.model';
import { AddWorkerDto, AddWorkerRequestDto } from './dto/worker.dto';
@Controller('/worker')
export class WorkerController {
  constructor(
    private readonly userService: UserService,
    private readonly WorkerService: WorkerService,
  ) {}

  @Get('/:id')
  async getWorker(
    @Param('id') id,
    @Req() request: Request,
    @Query() query?: { status: MEMBER_STATUS_ENUM },
  ): Promise<IWorker[]> {
    const token = request.headers['authorization'] as string;
    const user = await this.userService.getUserByToken(token);
    return await this.WorkerService.getWorkerByTaskID(id);
  }

  // @Get('name')
  // async getMemberByName(
  //   @Req() request: Request,
  //   @Query() query: { name: string },
  // ): Promise<IProfile[]> {
  //   const token = request.headers['authorization'] as string;
  //   return await this.MemberService.getMemberFromLdapByName(query.name, token);
  // }

  // @Get('/senderId')
  // async getMemberBySenderId(
  //   @Req() request: Request,
  // ): Promise<Member[]> {
  //   const token = request.headers['authorization'] as string;
  //   const user = await this.userService.getUserByToken(token);
  //   return await this.MemberService.getMemberBySenderId(user.id);
  // }

  // @Get('/:id')
  // async getMemberByProjectID(
  //   @Param('id') id: number,
  //   @Req() request: Request,
  // ): Promise<Member[]> {
  //   const token = request.headers['authorization'] as string;
  //   const user = await this.userService.getUserByToken(token);
  //   return await this.MemberService.getMemberByProjectID(id, user.id);
  // }

  @Post()
  async createMember(
    @Body() worker: AddWorkerRequestDto,
    @Req() request: Request,
  ): Promise<Worker> {
    const token = request.headers['authorization'] as string;
    const sender = await this.userService.getUserByToken(token);
    const payload = {
      senderId: sender.id,
      taskId: worker.taskId,
    } as AddWorkerDto;
    return await this.WorkerService.createWorker(
      payload
    );
  }

  // @Put('/:id')
  // async updateProject(
  //   @Param('id') id: number,
  //   @Body() member: UpdateMemberDto,
  //   @Req() request: Request,
  // ): Promise<[affectedCount: number]> {
  //   const token = request.headers['authorization'] as string;
  //   const user = await this.userService.getUserByToken(token);
  //   return await this.MemberService.updateMember(user.id, member);
  // }

  // @Put('updateStatus/:id')
  // async updateMemberStatus(
  //   @Param('id') id: number,
  //   @Body() member: { status: MEMBER_STATUS_ENUM },
  //   @Req() request: Request,
  // ): Promise<[affectedCount: number]> {
  //   const token = request.headers['authorization'] as string;
  //   const user = await this.userService.getUserByToken(token);
  //   return await this.MemberService.updateMemberStatus({
  //     id,
  //     status: member.status,
  //     userId: user.id,
  //   });
  // }

  @Delete('/:id')
  async deleteProject(
    @Param('id') id: number,
    // @Req() request: Request,
  ): Promise<String> {
    // const token = request.headers['authorization'] as string;
    // const user = await this.userService.getUserByToken(token);
    return await this.WorkerService.deleteWorker(id);
  }
}
