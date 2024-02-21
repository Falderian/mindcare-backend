import { IsDate, IsNotEmpty, IsNumber, isNotEmpty } from 'class-validator';

export class CreateConsultationDto {
  @IsNotEmpty()
  @IsNumber()
  patientId: number;

  @IsNotEmpty()
  @IsDate()
  startTime: Date;
}
