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
import { RoleService } from './role.service';
import { Role } from 'src/models/role.model';
import { RoleDto } from './dto/role.dto';
import { UserService } from '../user/services/user.service';

@Controller('/role')
export class RoleController {
  constructor(
    private readonly roleService: RoleService,
    private readonly userService: UserService,
  ) {}

  @Get()
  async getRole(): Promise<Role[]> {
    return await this.roleService.getRole();
  }

  @Get('/:id')
  async getRoleById(@Param('id') id: number): Promise<Role> {
    return await this.roleService.getRoleById(id);
  }

  @Get('project/:id')
  async getRoleByProjectId(
    @Param('id') id: number,
    @Req() request: Request,
  ): Promise<Role> {
    const token = request.headers['authorization'] as string;
    const user = await this.userService.getUserByToken(token);
    return await this.roleService.getRoleByProjectId(id, user.id);
  }

  @Post()
  async createRole(@Body() role: RoleDto): Promise<Role> {
    return await this.roleService.createRole(role);
  }

  @Put('/:id')
  async updateRole(
    @Param('id') id: number,
    @Body() role: RoleDto,
  ): Promise<[affectedCount: number]> {
    return await this.roleService.updateRole(id, role);
  }

  @Delete('/:id')
  async deleteRole(@Param('id') id: number): Promise<number> {
    return await this.roleService.deleteRole(id);
  }
}
