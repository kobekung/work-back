import { Module } from '@nestjs/common';
import { RoleController } from './role.controller';
import { RoleService } from './role.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { Role } from 'src/models/role.model';

@Module({
  imports: [SequelizeModule.forFeature([Role])],
  controllers: [RoleController],
  providers: [RoleService],
})
export class RoleModule {}
