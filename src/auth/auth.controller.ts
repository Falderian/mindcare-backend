import { Body, Controller, Post } from '@nestjs/common';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('sign-in')
  async signIn(@Body() dto: CreateUserDto) {
    return this.authService.signIn(dto.email, dto.password);
  }

  @Post('sign-up')
  async signUp(@Body() dto: CreateUserDto) {
    return this.authService.signUp(dto);
  }
}
