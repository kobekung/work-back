import { Module } from '@nestjs/common';
import { UserModule } from 'src/modules/user/user.module';
import { SequelizeModule } from '@nestjs/sequelize';
import { User } from 'src/models/user.model';
import * as dotenv from 'dotenv';

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
      models: [User],
    }),
    UserModule,
  ],
})
export class MasterModule {}
