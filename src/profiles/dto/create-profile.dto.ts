import { IsInt } from 'class-validator';

export class CreateProfileDto {
  @IsInt()
  userId: number;
}
