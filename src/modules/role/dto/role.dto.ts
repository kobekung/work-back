import { Type } from 'class-transformer';
import { IsBoolean, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class RoleDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsBoolean()
  @IsOptional()
  @Type(() => Boolean)
  isEditPlan?: boolean;

  @IsBoolean()
  @IsOptional()
  @Type(() => Boolean)
  isEditProject?: boolean;

  @IsBoolean()
  @IsOptional()
  @Type(() => Boolean)
  isEditTask?: boolean;
}
