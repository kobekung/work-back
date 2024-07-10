import { IsNotEmpty, IsNumber, IsOptional } from 'class-validator';
import { MEMBER_STATUS_ENUM } from 'src/enum/member.status';

export class AddMemberDto {
  @IsNumber()
  @IsNotEmpty()
  projectId: number;

  @IsNumber()
  @IsNotEmpty()
  userId: number;

  @IsNumber()
  @IsNotEmpty()
  roleId?: number;

  @IsNumber()
  @IsOptional()
  status?: number;

  @IsNumber()
  @IsOptional()
  senderId?: number;
}

export class UpdateMemberDto {
  @IsNumber()
  @IsNotEmpty()
  id: number;

  @IsNumber()
  @IsOptional()
  roleId?: number;

  @IsNumber()
  @IsOptional()
  projectId?: number;
}

export class UpdateMemberStatusDto {
  @IsNumber()
  @IsNotEmpty()
  id: number;

  @IsNumber()
  @IsNotEmpty()
  userId: number;

  @IsNumber()
  @IsNotEmpty()
  status: MEMBER_STATUS_ENUM;
}
