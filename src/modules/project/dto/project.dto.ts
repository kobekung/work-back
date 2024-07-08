import { Type } from 'class-transformer';
import {
  IsDate,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { PROJECT_UNIT_ENUM } from 'src/enum/project.unit.enum';

export class CreateProjectDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsDate()
  @IsNotEmpty()
  @Type(() => Date)
  startDate: Date;

  @IsDate()
  @IsNotEmpty()
  @Type(() => Date)
  endDate: Date;

  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  type?: number;

  @IsString()
  @IsOptional()
  unit?: string;

  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  status?: number;

  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  budgetYear?: number;

  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  ownerUnitId?: number;

  @IsString()
  @IsOptional()
  projectUnit?: PROJECT_UNIT_ENUM;
}
