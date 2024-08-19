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
import { UnitModule } from 'src/modules/unit/unit.module';
import { ProjectUnitModule } from 'src/modules/project_unit/project_unit.module';
import { GatewayModule } from 'src/modules/gateway/gateway.module';
import { Plan } from 'src/models/plan.model';
import { PlanModule } from 'src/modules/plan/plan.module';
import { Task } from 'src/models/task.model';
import { TaskLog } from 'src/models/task_log.model';
import { Worker } from 'src/models/worker.model';
import { PdfModule } from 'src/modules/pdf/pdf.module';

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
      models: [
        User,
        Role,
        Member,
        ProjectLog,
        Project,
        ProjectUnit,
        Plan,
        Task,
        TaskLog,
        Worker,
      ],
    }),
    UserModule,
    ProjectModule,
    RoleModule,
    MemberModule,
    UnitModule,
    ProjectUnitModule,
    GatewayModule,
    PlanModule,
    PdfModule,
  ],
})
export class MasterModule {}
