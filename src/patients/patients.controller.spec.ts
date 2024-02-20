import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Patient } from './entities/patient.entity';
import { PatientsModule } from './patients.module';
import { PatientController } from './patients.controller';
import { UsersService } from '../users/users.service';
import { User } from '../users/entities/user.entity';
import { DBConfig } from '../config/dg.config';
import { clearDatabase } from '../utils/utils';

describe('PatientController', () => {
  let controller: PatientController;
  let module: TestingModule;
  let registeredPatient: Patient;
  const userRepo = TypeOrmModule.forFeature([User]);
  const patientRepo = TypeOrmModule.forFeature([Patient]);

  const newUser = {
    email: 'patient@patient.com',
    password: (Math.random() * 100000).toFixed(),
    name: 'test',
    role: 'patient',
  };

  const createPatientDto = {
    dateOfBirth: new Date('1990-01-01'),
    gender: 'Male',
    address: '123 Main Street',
    phoneNumber: '123-456-7890',
  };

  beforeAll(async () => {
    module = await Test.createTestingModule({
      imports: [DBConfig, patientRepo, userRepo, PatientsModule],
      controllers: [PatientController],
      providers: [UsersService],
    }).compile();

    controller = module.get<PatientController>(PatientController);
  });

  afterAll(async () => await clearDatabase(module));

  it('should create a patient', async () => {
    const userService = module.get<UsersService>(UsersService);
    const registeredUser = await userService.create(newUser);

    const patientDto = { ...createPatientDto, userId: registeredUser.id };
    registeredPatient = await controller.create(patientDto);

    expect(registeredPatient).toBeDefined();
    expect(registeredUser.id).toEqual(patientDto.userId);
    expect(registeredPatient.address).toEqual(patientDto.address);
  });

  it('should find one patient by id', async () => {
    const foundPatient = await controller.findOne(registeredPatient.id.toString());
    expect(foundPatient).toEqual(registeredPatient);
  });

  it('should update a patient', async () => {
    const updatedPatientData = { address: 'Updated Address' };
    const updatedPatient = await controller.update(registeredPatient.id.toString(), updatedPatientData);
    expect(updatedPatient.address).toBe(updatedPatientData.address);
  });

  it('should remove a patient', async () => {
    const result = await controller.remove(registeredPatient.id.toString());
    expect(result).toBe(`Patient with id ${registeredPatient.id} has been successfully removed`);
  });
});
