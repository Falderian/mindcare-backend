import { IsDateString, IsNotEmpty, IsNumber, IsString, MinDate } from 'class-validator';

export class CreateTaskDto {
  @IsNumber()
  @IsNotEmpty()
  patientId: number;

  @IsNotEmpty()
  @IsString()
  description: string;

  @IsNotEmpty()
  @IsDateString()
  dueDate: Date;
}
