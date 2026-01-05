import { Module } from '@nestjs/common';
import { AppointmentsService } from './appointments.service';
import { AppointmentsController } from './appointments.controller';
import { PrismaService } from 'src/prisma/prisma.service';
import { NotesService } from 'src/notes/notes.service';
import { RecommendationsService } from 'src/recommendations/recommendations.service';
import { NotesModule } from 'src/notes/notes.module';
import { RecommendationsModule } from 'src/recommendations/recommendations.module';

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
