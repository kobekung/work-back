import { Controller, Get, Param, Req } from '@nestjs/common';
import { UnitService } from './unit.service';
import { IUnit } from 'src/interface/unit.interface';

@Controller('/Unit')
export class UnitController {
  constructor(private readonly UnitService: UnitService) {}

  @Get()
  async getUnit(@Req() request: Request): Promise<IUnit[]> {
    const token = request.headers['authorization'] as string;
    return await this.UnitService.getUnitByToken(token);
  }
}
