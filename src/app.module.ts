import { Module, OnModuleInit } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MasterModule } from './config/master.module';
import { SeedModule } from './seed/Seed.module';
import { RoleSeederService } from './seed/Role/services';

@Module({
  imports: [MasterModule, SeedModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements OnModuleInit {
  constructor(private readonly roleSeederService: RoleSeederService) {}

  async onModuleInit() {
    console.log("hit")
    await this.roleSeederService.seedRoles();
  }
}
