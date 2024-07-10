import { Module } from '@nestjs/common';
import { Gateway } from './gateway';
import { SequelizeModule } from '@nestjs/sequelize';
import { User } from 'src/models/user.model';

@Module({
    imports: [SequelizeModule.forFeature([User])],
    providers: [Gateway]
})
export class GatewayModule {}
