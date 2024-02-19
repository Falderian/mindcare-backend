import { IsNotEmpty, IsNumber, IsString, Max } from 'class-validator';

export class CreateNoteDto {
  @IsNotEmpty()
  @IsNumber()
  patientId: number;

  @IsNotEmpty()
  date: Date;

  @IsNotEmpty()
  @IsNumber()
  @Max(6)
  moodRating: number;

  @IsNotEmpty()
  @IsString()
  text: string;

  @IsNotEmpty()
  @IsString()
  conclusion: string;
}
