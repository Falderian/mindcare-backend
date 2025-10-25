import { IsEmail, IsStrongPassword, MinLength } from 'class-validator';

export class CreateUserDto {
  @MinLength(5)
  @IsEmail()
  email: string;

  @IsStrongPassword({
    minLength: 8,
    minLowercase: 1,
    minNumbers: 1,
    minSymbols: 1,
    minUppercase: 1,
  })
  password: string;
}
