import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import * as dotenv from 'dotenv';
import { IUnit } from 'src/interface/unit.interface';
import { getUnit } from 'src/utils/profile';

dotenv.config();

@Injectable()
export class UnitService {
  constructor() {}

  async getUnitByToken(token: string): Promise<IUnit[]> {
    try {
      if (!token) {
        throw new HttpException('Token is required', HttpStatus.BAD_REQUEST);
      }
      const unit = await getUnit(token);
      return unit;
    } catch (err) {
      throw new HttpException(err.response, err.status);
    }
  }
}
