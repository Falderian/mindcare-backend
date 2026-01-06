import { Module } from '@nestjs/common';
import { NotesModule } from '../notes/notes.module';
import { NotesService } from '../notes/notes.service';
import { PrismaService } from '../prisma/prisma.service';
import { RecommendationsModule } from '../recommendations/recommendations.module';
import { RecommendationsService } from '../recommendations/recommendations.service';
import { AppointmentsController } from './appointments.controller';
import { AppointmentsService } from './appointments.service';

@Module({
  imports: [NotesModule, RecommendationsModule],
  controllers: [AppointmentsController],
  providers: [
    AppointmentsService,
    PrismaService,
    NotesService,
    RecommendationsService,
  ],
})
export class AppointmentsModule {}
