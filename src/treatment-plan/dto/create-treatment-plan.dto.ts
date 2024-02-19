import { Type } from 'class-transformer';
import { IsNotEmpty, IsNumber, IsDate, MinDate, Validate } from 'class-validator';

export class CreateTreatmentPlanDto {
  @IsNumber()
  @IsNotEmpty()
  patientId: number;

  @Type(() => Date)
  startDate: Date;

  @Validate(({ value }) => value >= new Date(), { message: 'endDate must be after startDate' })
  @Type(() => Date)
  endDate: Date;

  @IsNotEmpty()
  description: string;
}
