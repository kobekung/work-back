import { Module } from '@nestjs/common';
import { UserModule } from 'src/modules/user/user.module';
import { SequelizeModule } from '@nestjs/sequelize';
import { User } from 'src/models/user.model';
import * as dotenv from 'dotenv';
import { ProjectModule } from 'src/modules/project/project.module';
import { Project } from 'src/models/project.model';
import { RoleModule } from 'src/modules/role/role.module';
import { Role } from 'src/models/role.model';
import { Member } from 'src/models/member.model';
import { MemberModule } from 'src/modules/member/member.module';
import { ProjectLog } from 'src/models/project_log.model';
import { ProjectUnit } from 'src/models/project_unit.model';
import { GatewayModule } from 'src/modules/gateway/gateway.module';

dotenv.config();
@Module({
  imports: [
    SequelizeModule.forRoot({
      dialect: process.env.DIALECT as
        | 'mysql'
        | 'mariadb'
        | 'postgres'
        | 'mssql'
        | 'sqlite',
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT),
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DATABASE,
      autoLoadModels: true,
      synchronize: true,
      models: [User, Project, Role, Member, ProjectLog, ProjectUnit],
    }),
    UserModule,
    ProjectModule,
    RoleModule,
    MemberModule,
    GatewayModule
  ],
})
export class MasterModule {}
