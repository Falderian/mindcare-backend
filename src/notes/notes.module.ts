import { Module } from '@nestjs/common';
import { NotesService } from './notes.service';
import { NotesController } from './notes.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Note } from './entities/note.entity';
import { PatientProfileModule } from 'src/patientprofile/patientprofile.module';

const NotesPepository = TypeOrmModule.forFeature([Note]);

@Module({
  imports: [NotesPepository, PatientProfileModule],
  controllers: [NotesController],
  providers: [NotesService],
  exports: [NotesPepository, NotesService],
})
export class NotesModule {}
