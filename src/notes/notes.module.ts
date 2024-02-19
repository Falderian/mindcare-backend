import { Module } from '@nestjs/common';
import { NotesService } from './notes.service';
import { NotesController } from './notes.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Note } from './entities/note.entity';
import { PatientsModule } from '../patients/patients.module';

const NotesPepository = TypeOrmModule.forFeature([Note]);

@Module({
  imports: [NotesPepository, PatientsModule],
  controllers: [NotesController],
  providers: [NotesService],
  exports: [NotesPepository, NotesService],
})
export class NotesModule {}
