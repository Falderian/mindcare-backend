import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NotesController } from './notes.controller';
import { NotesService } from './notes.service';
import { Note } from './entities/note.entity';
import { PatientsService } from '../patients/patients.service';
import { Patient } from '../patients/entities/patient.entity';
import { clearDatabase } from '../utils/utils';
import { CreateNoteDto } from './dto/create-note.dto';
import { CreatePatientDto } from '../patients/dto/create-patient.dto';
import { UsersService } from '../users/users.service';
import { User } from '../users/entities/user.entity';
import { DBConfig } from '../config/dg.config';

describe('NotesController', () => {
  let controller: NotesController;
  let module: TestingModule;
  let createdNote: Note;
  let user: User;
  let patient: Patient;
  const userRepo = TypeOrmModule.forFeature([User]);
  const patientRepo = TypeOrmModule.forFeature([Patient]);
  const noteRepo = TypeOrmModule.forFeature([Note]);

  const newUser = {
    email: 'note@note.com',
    password: 'password',
    name: 'Test User',
    role: 'patient',
  };

  const createPatientDto: CreatePatientDto = {
    userId: 0,
    dateOfBirth: new Date('1990-01-01'),
    gender: 'Male',
    address: '123 Main Street',
    phoneNumber: '1234567890',
  };

  const createNoteDto: CreateNoteDto = {
    patientId: 0,
    date: new Date(),
    moodRating: 5,
    text: 'Test note',
    conclusion: 'Test conclusion',
  };

  beforeAll(async () => {
    module = await Test.createTestingModule({
      imports: [DBConfig, userRepo, noteRepo, patientRepo],
      controllers: [NotesController],
      providers: [NotesService, PatientsService, UsersService],
    }).compile();

    controller = module.get<NotesController>(NotesController);

    const userService = module.get<UsersService>(UsersService);
    user = await userService.create(newUser);

    const patientsService = module.get<PatientsService>(PatientsService);
    patient = await patientsService.create({ ...createPatientDto, userId: user.id });

    createNoteDto.patientId = patient.id;
  });

  afterAll(async () => await clearDatabase(module));

  it('should create a note', async () => {
    createdNote = await controller.create(createNoteDto);
    expect(createdNote.id).toBeDefined();
    expect(createdNote.patient.id).toEqual(createNoteDto.patientId);
    expect(createdNote.date).toEqual(createNoteDto.date);
    expect(createdNote.moodRating).toEqual(createNoteDto.moodRating);
    expect(createdNote.text).toEqual(createNoteDto.text);
    expect(createdNote.conclusion).toEqual(createNoteDto.conclusion);
  });

  it('should find notes of a patient by patient ID', async () => {
    const foundNotes = await controller.findAll(patient.id.toString());
    expect(foundNotes.length).toEqual(1);
    expect(foundNotes[0].id).toEqual(createdNote.id);
  });

  it('should update a note', async () => {
    const updatedNoteDto = {
      moodRating: 7,
      text: 'Updated test note',
      conclusion: 'Updated test conclusion',
    };
    const updatedNote = await controller.update(createdNote.id.toString(), updatedNoteDto);
    expect(updatedNote.moodRating).toEqual(updatedNoteDto.moodRating);
    expect(updatedNote.text).toEqual(updatedNoteDto.text);
    expect(updatedNote.conclusion).toEqual(updatedNoteDto.conclusion);
  });

  it('should remove a note', async () => {
    const result = await controller.remove(createdNote.id.toString());
    expect(result).toEqual({ message: 'Note removed successfully' });
  });
});
