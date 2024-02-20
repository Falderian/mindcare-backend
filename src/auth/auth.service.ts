import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../users/entities/user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { CreateUserDto } from '../users/dto/create-user.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string) {
    const user = await this.usersRepository.findOneBy({ email });
    const isMatch = await bcrypt.compare(password, user.password);
    if (user && isMatch) {
      delete user.password;
      return user;
    }
    return null;
  }

  async login(user: Omit<CreateUserDto, 'name'>) {
    const payload = { email: user.email };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
