import { Transform, Type } from 'class-transformer';
import {
  IsDate,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

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
  @Transform(({ value }) => parseInt(value))
  type?: number;

  @IsString()
  @IsOptional()
  @Transform(({ value }) => parseInt(value))
  unit?: number;

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
  @Transform(({ value }) => parseInt(value))
  ownerUnitId?: number;

  @IsNumber()
  @IsOptional()
  @Transform(({ value }) => parseInt(value))
  projectUnitId?: number;
}
