import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateRecommendationDTO } from './dto/create-recommendation.dto';

@Injectable()
export class RecommendationsService {
  constructor(private prisma: PrismaService) {}

  async create() {
    return this.prisma.recommendation.create({
      data: { content: '' },
    });
  }

  async findAll() {
    return this.prisma.recommendation.findMany();
  }

  async findOne(id: number) {
    return this.prisma.recommendation.findUnique({
      where: { id },
    });
  }

  async update(
    id: number,
    updateRecommendationDto: Pick<CreateRecommendationDTO, 'content'>,
  ) {
    return this.prisma.recommendation.update({
      where: { id },
      data: updateRecommendationDto,
    });
  }

  async remove(id: number) {
    return this.prisma.recommendation.delete({
      where: { id },
    });
  }
}
