import { TestingModule } from '@nestjs/testing';
import { setupTestingModule, createUser, clearDatabase } from '../utils/testUtils';
import { Patient } from './entities/patient.entity';
import { PatientsController } from './patients.controller';

describe('PatientsController', () => {
  let controller: PatientsController;
  let module: TestingModule;
  let registeredPatient: Patient;

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
    module = await setupTestingModule();
    controller = module.get<PatientsController>(PatientsController);
  });

  afterAll(async () => await clearDatabase(module));

  it('should create a patient', async () => {
    const registeredUser = await createUser(module, newUser);
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
