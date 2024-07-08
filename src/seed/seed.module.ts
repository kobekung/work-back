import { Module } from '@nestjs/common';
import { RoleSeedModule } from './Role/module';

@Module({
  imports: [RoleSeedModule],
  exports: [RoleSeedModule],
})
export class SeedModule {}
