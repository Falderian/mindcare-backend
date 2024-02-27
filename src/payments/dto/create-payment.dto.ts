import { Type } from 'class-transformer';
import { IsNotEmpty, IsNumber, Min } from 'class-validator';
import { Column } from 'typeorm';

export class CreatePaymentDto {
  @IsNotEmpty()
  @IsNumber()
  patientId: number;

  @IsNotEmpty()
  @Min(10)
  amount: number;

  @Type(() => Date)
  payment_date: Date;
}
