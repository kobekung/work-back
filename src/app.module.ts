import { MiddlewareConsumer, Module, OnModuleInit } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MasterModule } from './config/master.module';
import { SeedModule } from './seed/seed.module';
import { RoleSeederService } from './seed/Role/services';
import { ProjectUnitSeederService } from './seed/Project_Unit/services';
import { VerifyMiddleware } from './middleware/checktoken.middleware';

@Module({
  imports: [MasterModule, SeedModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements OnModuleInit {
  constructor(
    private readonly roleSeederService: RoleSeederService,
    private readonly ProjectUnitService: ProjectUnitSeederService,
  ) {}

  async onModuleInit() {
    await this.roleSeederService.seedRoles();
    await this.ProjectUnitService.seed();
  }
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(VerifyMiddleware).forRoutes('project');
  }
}
