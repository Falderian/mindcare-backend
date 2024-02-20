import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateProgressAnalysisDto {
  @IsNotEmpty()
  @IsNumber()
  patientId: number;

  @IsNotEmpty()
  @IsString()
  progressSummary: string;
}
