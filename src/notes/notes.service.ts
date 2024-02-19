import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateNoteDto } from './dto/create-note.dto';
import { UpdateNoteDto } from './dto/update-note.dto';
import { Repository } from 'typeorm';
import { Note } from './entities/note.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { PatientsService } from '../patients/patients.service';

@Injectable()
export class NotesService {
  constructor(
    @InjectRepository(Note)
    private notesRepository: Repository<Note>,
    private patientsService: PatientsService,
  ) {}

  async create(createNoteDto: CreateNoteDto) {
    const patient = await this.patientsService.findOne(createNoteDto.patientId);
    try {
      const newNote = await this.notesRepository.save({ ...createNoteDto, patient });
      return newNote;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async findAll(patientId: number) {
    try {
      const patient = await this.patientsService.findOne(patientId);
      const notes = await this.notesRepository.find({ where: { patient } });
      return notes;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async findOne(id: number) {
    try {
      const note = await this.notesRepository.findOneBy({ id });
      if (!note) throw new NotFoundException('Note not found');
      return note;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async update(id: number, updateNoteDto: UpdateNoteDto) {
    try {
      const note = await this.findOne(id);
      const updatedNote = await this.notesRepository.save({ ...note, ...updateNoteDto });
      return updatedNote;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async remove(id: number) {
    try {
      const note = await this.findOne(id);
      await this.notesRepository.remove(note);
      return { message: 'Note removed successfully' };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
}
