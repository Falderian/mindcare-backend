import {
  IsDate,
  IsDateString,
  IsEnum,
  IsNotEmpty,
  IsPositive,
} from 'class-validator';
import { AppointmentMode } from 'generated/prisma';

export class CreateAppointmentDto {
  @IsNotEmpty()
  @IsPositive()
  userId: number;

  @IsNotEmpty()
  @IsEnum(AppointmentMode)
  mode: AppointmentMode;

  @IsDateString()
  date: Date;
}
