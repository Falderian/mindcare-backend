import { IsEnum, IsNotEmpty } from 'class-validator';
import { AppointmentMode, AppointmentStatus } from 'generated/prisma';

export class UpdateAppointmentDTO {
  @IsNotEmpty()
  @IsEnum(AppointmentStatus)
  status: AppointmentStatus;

  @IsNotEmpty()
  @IsEnum(AppointmentMode)
  mode: AppointmentMode;
}
