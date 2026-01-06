import { IsDateString, IsEnum, IsNotEmpty, IsPositive } from 'class-validator';
import { Appointment, AppointmentMode } from '../../../generated/prisma';

export class CreateAppointmentDto
  implements Pick<Appointment, 'mode' | 'userId' | 'date'>
{
  @IsNotEmpty()
  @IsPositive()
  userId: number;

  @IsNotEmpty()
  @IsEnum(AppointmentMode)
  mode: AppointmentMode;

  @IsDateString()
  date: Date;
}
