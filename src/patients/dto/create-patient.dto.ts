import { IsIn, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreatePatientDto {
  @IsNotEmpty()
  @IsNumber()
  userId: number;

  @IsNotEmpty()
  dateOfBirth: Date;

  @IsNotEmpty()
  @IsString()
  @IsIn(['male', 'female'], { message: 'Gender must be either "male" or "female"' })
  gender: string;

  @IsNotEmpty()
  @IsString()
  address: string;

  @IsNotEmpty()
  @IsString()
  phoneNumber: string;
}
