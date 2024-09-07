import { Type } from 'class-transformer';
import { IsDate, IsNumber, IsOptional, IsString } from 'class-validator';
import { STATUS_ENUM } from 'src/enum/status.enum';

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
  status: STATUS_ENUM;
}
