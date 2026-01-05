import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { NotesService } from 'src/notes/notes.service';
import { RecommendationsService } from 'src/recommendations/recommendations.service';
import { AppointmentStatus } from 'generated/prisma';
import { UpdateAppointmentDTO } from './dto/update-appointment..dto';

@Injectable()
export class AppointmentsService {
  constructor(
    private prisma: PrismaService,
    private readonly notesService: NotesService,
    private readonly recommendationsService: RecommendationsService,
  ) {}

  async create(createAppointmentDto: CreateAppointmentDto) {
    const note = await this.notesService.create();
    const recommendation = await this.recommendationsService.create();

    return this.prisma.appointment.create({
      data: {
        ...createAppointmentDto,
        status: 'scheduled',
        noteId: note.id,
        recommendationId: recommendation.id,
      },
      include: {
        note: true,
        recommendation: true,
      },
    });
  }

  async findAll() {
    return this.prisma.appointment.findMany({
      include: {
        note: true,
        recommendation: true,
      },
    });
  }

  async findOne(id: number) {
    return this.prisma.appointment.findUnique({
      where: { id },
      include: {
        note: true,
        recommendation: true,
      },
    });
  }

  async update(id: number, updateAppointmentDto: UpdateAppointmentDTO) {
    return this.prisma.appointment.update({
      where: { id },
      data: updateAppointmentDto,
      include: {
        note: true,
        recommendation: true,
      },
    });
  }

  async remove(id: number) {
    return this.prisma.appointment.delete({
      where: { id },
      include: {
        note: true,
        recommendation: true,
      },
    });
  }
}
