import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class AddWorkerDto {
  @IsNumber()
  @IsNotEmpty()
  taskId: number;

  @IsNumber()
  @IsNotEmpty()
  userId: number;

  @IsNumber()
  @IsOptional()
  senderId: number;
}
export class AddWorkerRequestDto {
  @IsNumber()
  @IsNotEmpty()
  taskId: number;

  @IsString()
  @IsNotEmpty()
  id: string;
}
