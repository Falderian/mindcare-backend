import { IsNotEmpty, IsNumber } from 'class-validator';

export class CreateChatDto {
  @IsNotEmpty()
  senderId: number;

  @IsNotEmpty()
  @IsNumber()
  recipientId: number;
}
