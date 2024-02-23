import { IsNotEmpty, IsNumber, MinLength } from 'class-validator';

export class CreateMessageDto {
  @IsNotEmpty()
  @IsNumber()
  senderId: number;

  @IsNotEmpty()
  @IsNumber()
  recipientId: number;

  @IsNotEmpty()
  @MinLength(10)
  content: string;
}
