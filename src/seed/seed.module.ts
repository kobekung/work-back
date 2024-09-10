import { Module } from '@nestjs/common';
import { RoleSeedModule } from './Role/module';
import { ProjectUnitSeedModule } from './Project_Unit/module';

@Module({
  imports: [RoleSeedModule, ProjectUnitSeedModule],
  exports: [RoleSeedModule, ProjectUnitSeedModule],
})
export class SeedModule {}
