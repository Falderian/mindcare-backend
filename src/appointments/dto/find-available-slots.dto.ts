import { IsDateString } from 'class-validator';

export class FindAvailableSlotsDto {
  @IsDateString()
  date: string;
}
