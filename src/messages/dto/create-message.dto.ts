import { IsNotEmpty, IsNumber, MinLength } from "class-validator";

export class CreateMessageDto {
  @IsNotEmpty()
  chatId: number;

  @IsNotEmpty()
  @IsNumber()
  senderId: number;

  @IsNotEmpty()
  @IsNumber()
  recepientId: number;

  @IsNotEmpty()
  @MinLength(10)
  content: string;
}
