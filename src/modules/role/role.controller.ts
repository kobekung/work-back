import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { RoleService } from './role.service';
import { Role } from 'src/models/role.model';
import { RoleDto } from './dto/role.dto';

@Controller('/role')
export class RoleController {
  constructor(private readonly roleService: RoleService) {}

  @Get()
  async getRole(): Promise<Role[]> {
    return await this.roleService.getRole();
  }

  @Get('/:id')
  async getRoleById(@Param('id') id: number): Promise<Role> {
    return await this.roleService.getRoleById(id);
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
