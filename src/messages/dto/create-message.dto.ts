import { IsNotEmpty, IsNumber, Min, MinLength } from 'class-validator';
import { Chat } from '../../chats/entities/chat.entity';

export class CreateMessageDto {
  @IsNotEmpty()
  chatId: number;

  @IsNotEmpty()
  @IsNumber()
  senderId: number;

  @IsNotEmpty()
  @IsNumber()
  recipientId: number;

  @IsNotEmpty()
  @MinLength(10)
  message: string;
}
