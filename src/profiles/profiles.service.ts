import { Injectable } from '@nestjs/common';
import { PrismaErrorHandler } from '../prisma/prisma-error.handler';
import { PrismaService } from '../prisma/prisma.service';
import { CreateProfileDto } from './dto/create-profile.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';

@Injectable()
export class ProfilesService {
  constructor(private prisma: PrismaService) {}

  async create({ userId }: CreateProfileDto) {
    try {
      await this.prisma.profile.create({ data: { userId } });
    } catch (error) {
      PrismaErrorHandler.handle(error, 'Create Profile');
    }
  }

  async findOne(id: number) {
    try {
      return await this.prisma.profile.findUniqueOrThrow({
        where: { userId: id },
      });
    } catch (error) {
      PrismaErrorHandler.handle(error, 'Find Profile');
    }
  }

  async update(id: number, data: UpdateProfileDto) {
    try {
      return await this.prisma.profile.update({ where: { userId: id }, data });
    } catch (error) {
      PrismaErrorHandler.handle(error, 'Update Profile');
    }
  }

  async remove(id: number) {
    try {
      return await this.prisma.profile.delete({ where: { userId: id } });
    } catch (error) {
      PrismaErrorHandler.handle(error, 'Delete Profile');
    }
  }
}
