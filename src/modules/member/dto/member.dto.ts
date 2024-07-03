import { IsNotEmpty, IsNumber, IsOptional } from 'class-validator';

export class AddMemberDto {
  @IsNumber()
  @IsNotEmpty()
  projectId: number;

  @IsNumber()
  @IsNotEmpty()
  userId: number;

  @IsNumber()
  @IsOptional()
  roleId?: number;

  @IsNumber()
  @IsOptional()
  status?: number;
}
