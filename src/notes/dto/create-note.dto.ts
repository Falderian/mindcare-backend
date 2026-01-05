import { Optional } from '@nestjs/common';
import { IsNotEmpty, isNotEmpty, IsPositive } from 'class-validator';

export class CreateNoteDTO {
  @IsNotEmpty()
  @IsPositive()
  appointmentId: number;

  @Optional()
  content: string;
}
