import { IsNumber, IsString } from 'class-validator';

export class AddCommentDto {
  @IsNumber()
  taskId: number;

  @IsString()
  comment: string;
}

export class UpdateCommentDto {
  @IsNumber()
  id: number;

  @IsString()
  comment: string;
}
