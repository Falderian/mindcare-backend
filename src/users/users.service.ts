import { Injectable } from '@nestjs/common';
import { PrismaErrorHandler } from 'src/prisma/prisma-error.handler';
import { PrismaService } from 'src/prisma/prisma.service';
import { ProfilesService } from 'src/profiles/profiles.service';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UsersService {
  constructor(
    private prisma: PrismaService,
    private profilesService: ProfilesService,
  ) {}

  async create(data: CreateUserDto) {
    try {
      const user = await this.prisma.user.create({ data });
      this.profilesService.create({ userId: user.id });
      return { id: user.id, email: user.email };
    } catch (error) {
      PrismaErrorHandler.handle(error, 'Create User');
    }
  }

  async findByEmail(email: string) {
    try {
      return await this.prisma.user.findFirst({ where: { email } });
    } catch (error) {
      PrismaErrorHandler.handle(error, 'Find By Email User');
    }
  }

  async remove(id: number) {
    try {
      return await this.prisma.user.delete({ where: { id } });
    } catch (error) {
      PrismaErrorHandler.handle(error, 'Remove User');
    }
  }
}
