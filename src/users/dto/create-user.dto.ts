import { IsEmail, IsNotEmpty, IsStrongPassword, MinLength } from "class-validator";

export class CreateUserDto {
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @MinLength(4)
  name: string;

  @IsNotEmpty()
  @MinLength(8)
  password: string;
}
