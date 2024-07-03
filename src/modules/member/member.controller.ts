import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { AddMemberDto } from './dto/member.dto';
import { MemberService } from './member.service';
import { Member } from 'src/models/member.model';
@Controller('/Member')
export class MemberController {
    constructor(private readonly MemberService: MemberService) {}

    @Get()
    async getMemberByProjectID(@Param('id') id: number):Promise<Member[]> {
        return await this.MemberService.getMemberByProjectID(id);
    }

    @Get('/:id')
    async getMemberById(@Param('id') id: number): Promise<Member> {
        return await this.MemberService.getMemberById(id);
    }

    @Post()
    async createMember(@Body() member: AddMemberDto): Promise<String> {
        return await this.MemberService.createMember(member);
    }

    @Put('/:id')
    async updateProject(@Param('id') id: number, @Body() member: AddMemberDto): Promise<String> {
        return await this.MemberService.updateMember(id, member);
    }

    @Delete('/:id')
    async deleteProject(@Param('id') id: number): Promise<String> {
        return await this.MemberService.deleteMember(id);
    }
}
