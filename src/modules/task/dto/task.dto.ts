import { Transform, Type } from 'class-transformer';
import {
  IsDate,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsBoolean
} from 'class-validator';

export class CreateTaskDto {
  @IsString()
    // @IsNotEmpty()
    @IsOptional()
  name: string;

  @IsDate()
    // @IsNotEmpty()
    @IsOptional()
  @Type(() => Date)
  startDate: Date;

  @IsDate()
  // @IsNotEmpty()
    @IsOptional()
  @Type(() => Date)
  endDate: Date;

  @IsNumber()
    // @IsNotEmpty()
    @IsOptional()
  @Type(() => Number)
  planId: number;

  @IsNumber()
    // @IsNotEmpty()
    @IsOptional()
  @Type(() => Number)
  status: number;
}
