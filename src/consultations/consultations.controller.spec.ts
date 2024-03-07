import { TestingModule } from '@nestjs/testing';
import { ConsultationsController } from './consultations.controller';
import { CreateConsultationDto } from './dto/create-consultation.dto';
import { UpdateConsultationDto } from './dto/update-consultation.dto';
import { setupTestingModule, clearDatabase, createUser, createPatient } from '../utils/testUtils';
import { Consultation } from './entities/consultation.entity';
import { UserRole } from '../users/entities/user.entity';
import { Patient } from '../patients/entities/patient.entity';

describe('ConsultationsController', () => {
  let controller: ConsultationsController;
  let module: TestingModule;
  let createdConsultation: Consultation;

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

  const createConsultationDto: CreateConsultationDto = {
    patientId: 0,
    startTime: new Date(),
  };

  beforeAll(async () => {
    module = await setupTestingModule();
    controller = module.get<ConsultationsController>(ConsultationsController);

    user = await createUser(module, {
      email: 'consulation@consulation.com',
      password: 'password',
      name: 'Test User',
      role: 'patient',
    });

    patient = await createPatient(module, {
      userId: user.id,
      dateOfBirth: new Date('1990-01-01'),
      gender: 'Male',
      address: '123 Main Street',
      phoneNumber: '1234567890',
    });

    createConsultationDto.patientId = patient.id;
  });

  afterAll(async () => await clearDatabase(module));

  it('should create a consultation', async () => {
    createdConsultation = await controller.create(createConsultationDto);
    expect(createdConsultation.id).toBeDefined();
    expect(createdConsultation.patient.id).toEqual(createConsultationDto.patientId);
    expect(createdConsultation.startTime).toEqual(createConsultationDto.startTime);
  });

  it('should find consultations of a patient by patient ID', async () => {
    const foundConsultations = await controller.findAll(createConsultationDto.patientId.toString());
    expect(foundConsultations.length).toBeGreaterThan(0);
    expect(foundConsultations[0].id).toEqual(createdConsultation.id);
  });

  it('should update a consultation', async () => {
    const updatedConsultationDto: UpdateConsultationDto = {
      status: 'Updated status',
    };
    const updatedConsultation = await controller.update(createdConsultation.id.toString(), updatedConsultationDto);
    expect(updatedConsultation.status).toEqual(updatedConsultationDto.status);
  });

  it('should remove a consultation', async () => {
    const result = await controller.remove(createdConsultation.id.toString());
    expect(result).toEqual({ message: 'Consultation removed successfully' });
  });
});
