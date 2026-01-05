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

  async findAvailableSlots(date: Date) {
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);

    const appointments = await this.prisma.appointment.findMany({
      where: {
        date: {
          gte: startOfDay,
          lte: endOfDay,
        },
      },
    });

    const bookedHours = appointments.map((appt) =>
      new Date(appt.date).getHours(),
    );

    const availableHours: number[] = [];
    for (let hour = 9; hour < 18; hour++) {
      if (!bookedHours.includes(hour)) {
        availableHours.push(hour);
      }
    }

    return availableHours;
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
