import { TestingModule } from '@nestjs/testing';
import { TreatmentPlanController } from './treatment-plan.controller';
import { setupTestingModule, createUser, clearDatabase } from '../utils/testUtils';
import { CreateTreatmentPlanDto } from './dto/create-treatment-plan.dto';
import { UpdateTreatmentPlanDto } from './dto/update-treatment-plan.dto';
import { Patient } from '../patients/entities/patient.entity';
import { UsersService } from '../users/users.service';
import { User } from '../users/entities/user.entity';
import { CreatePatientDto } from '../patients/dto/create-patient.dto';
import { PatientsService } from '../patients/patients.service';
import { TreatmentPlan } from './entities/treatment-plan.entity';

describe('TreatmentPlanController', () => {
  let controller: TreatmentPlanController;
  let module: TestingModule;
  let createdPlan: TreatmentPlan;
  let user: User;
  let patient: Patient;

  const newUser = {
    email: 'treatmentplan@plan.com',
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

  const createPlanDto: CreateTreatmentPlanDto = {
    patientId: 0,
    startDate: new Date(),
    endDate: new Date('2024-02-28'),
    description: 'Test treatment plan',
  };

  beforeAll(async () => {
    module = await setupTestingModule();
    controller = module.get<TreatmentPlanController>(TreatmentPlanController);

    const userService = module.get<UsersService>(UsersService);
    user = await createUser(module, newUser);

    const patientsService = module.get<PatientsService>(PatientsService);
    patient = await patientsService.create({ ...createPatientDto, userId: user.id });

    createPlanDto.patientId = patient.id;
  });

  afterAll(async () => await clearDatabase(module));

  it('should create a treatment plan', async () => {
    createdPlan = (await controller.create(createPlanDto)) as TreatmentPlan;
    expect(createdPlan).toBeDefined();
    expect(createdPlan.description).toEqual(createPlanDto.description);
  });

  it('should find treatment plans of a patient by patient ID', async () => {
    const foundPlans = await controller.findAll(patient.id.toString());
    expect(foundPlans.length).toEqual(1);
    expect(foundPlans[0].description).toEqual(createPlanDto.description);
  });

  it('should update a treatment plan', async () => {
    const updatedPlanDto: UpdateTreatmentPlanDto = {
      startDate: new Date(),
      endDate: new Date('2024-03-15'),
      description: 'Updated test treatment plan',
    };
    const updatedPlan = await controller.update(createdPlan.id.toString(), updatedPlanDto);
    expect(updatedPlan).toBeDefined();
    expect(updatedPlan.description).toEqual(updatedPlanDto.description);
  });

  it('should remove a treatment plan', async () => {
    const result = await controller.remove(createdPlan.id.toString());
    expect(result).toBeDefined();
  });
});
