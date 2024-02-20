import { TestingModule } from '@nestjs/testing';
import { ProgressAnalysisController } from './progress-analysis.controller';
import { ProgressAnalysis } from './entities/progress-analysis.entity';
import { PatientsService } from '../patients/patients.service';
import { Patient } from '../patients/entities/patient.entity';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { setupTestingModule, createUser, clearDatabase } from '../utils/testUtils';
import { CreateProgressAnalysisDto } from './dto/create-progress-analysis.dto';
import { UpdateProgressAnalysisDto } from './dto/update-progress-analysis.dto';
import { User } from '../users/entities/user.entity';

describe('ProgressAnalysisController', () => {
  let controller: ProgressAnalysisController;
  let module: TestingModule;
  let createdAnalysis: ProgressAnalysis;
  let user: User;
  let patient: Patient;

  const createUserDto: CreateUserDto = {
    email: 'progressanalysis@analysis.com',
    password: 'password',
    name: 'Test User',
  };

  const createAnalysisDto: CreateProgressAnalysisDto = {
    patientId: 0,
    progressSummary: 'progressSummary',
  };

  beforeAll(async () => {
    module = await setupTestingModule();
    controller = module.get<ProgressAnalysisController>(ProgressAnalysisController);

    user = await createUser(module, createUserDto);

    const patientsService = module.get<PatientsService>(PatientsService);
    patient = await patientsService.create({
      userId: user.id,
      dateOfBirth: new Date('1990-01-01'),
      gender: 'Male',
      address: '123 Main Street',
      phoneNumber: '1234567890',
    });

    createAnalysisDto.patientId = patient.id;
  });

  afterAll(async () => {
    await clearDatabase(module);
  });

  it('should create a progress analysis', async () => {
    createdAnalysis = await controller.create(createAnalysisDto);
    expect(createdAnalysis.patient.id).toEqual(patient.id);
  });

  it('should find progress analyses of a patient by patient ID', async () => {
    const foundAnalyses = await controller.findOne(patient.id.toString());
    expect(foundAnalyses.length).toEqual(1);
    expect(foundAnalyses[0].progressSummary).toEqual(createAnalysisDto.progressSummary);
  });

  it('should update a progress analysis', async () => {
    const updatedAnalysisDto: UpdateProgressAnalysisDto = {
      progressSummary: 'updated progressSummary',
    };
    const updatedAnalysis = await controller.update(createdAnalysis.id.toString(), updatedAnalysisDto);
    expect(updatedAnalysis.progressSummary).toEqual(updatedAnalysisDto.progressSummary);
  });

  it('should remove a progress analysis', async () => {
    const result = await controller.remove(createdAnalysis.id.toString());
    expect(result.message).toEqual('Note removed successfully');
  });
});
