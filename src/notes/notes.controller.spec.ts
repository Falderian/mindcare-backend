import { TestingModule } from '@nestjs/testing';
import { NotesController } from './notes.controller';
import { Note } from './entities/note.entity';
import { PatientsService } from '../patients/patients.service';
import { Patient } from '../patients/entities/patient.entity';
import { CreateNoteDto } from './dto/create-note.dto';
import { CreatePatientDto } from '../patients/dto/create-patient.dto';
import { User, UserRole } from '../users/entities/user.entity';
import { setupTestingModule, createUser, clearDatabase } from '../utils/testUtils';

describe('NotesController', () => {
  let controller: NotesController;
  let module: TestingModule;
  let createdNote: Note;
  let user: {
    id: any;
    mailbox?: { id: number };
    email?: string;
    name?: string;
    password?: string;
    role?: UserRole;
    createdAt?: Date;
    updatedAt?: Date;
    patient?: Patient;
  };
  let patient: Patient;

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
    module = await setupTestingModule();
    controller = module.get<NotesController>(NotesController);

    user = await createUser(module, newUser);
    patient = await module.get<PatientsService>(PatientsService).create({ ...createPatientDto, userId: user.id });
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
