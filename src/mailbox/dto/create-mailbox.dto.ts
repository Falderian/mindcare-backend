import { IsNotEmpty, IsNumber } from 'class-validator';

export class CreateMailboxDto {
  @IsNotEmpty()
  @IsNumber()
  userId: number;
}
