import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';

export class CreateUserDto {
  @IsEmail()
  @IsNotEmpty()
  @MinLength(5)
  email: string;

  @IsNotEmpty()
  @MinLength(4)
  name: string;

  @IsNotEmpty()
  @MinLength(8)
  password: string;
}
