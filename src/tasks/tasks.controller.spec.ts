import { TestingModule } from '@nestjs/testing';
import { TasksController } from './tasks.controller';
import { Task } from './entities/task.entity';
import { PatientsService } from '../patients/patients.service';
import { Patient } from '../patients/entities/patient.entity';
import { setupTestingModule, createUser, clearDatabase } from '../utils/testUtils';
import { CreateTaskDto } from './dto/create-task.dto';

describe('TasksController', () => {
  let controller: TasksController;
  let module: TestingModule;
  let registeredTask: Task;
  let createTaskDto: CreateTaskDto;
  let createdPatient: Patient;

  const newUser = {
    email: 'task@task.com',
    password: 'password',
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
    controller = module.get<TasksController>(TasksController);

    const user = await createUser(module, newUser);

    const patientsService = module.get<PatientsService>(PatientsService);
    createdPatient = await patientsService.create({ ...createPatientDto, userId: user.id });

    createTaskDto = {
      patientId: createdPatient.id,
      description: 'description',
      dueDate: new Date(),
    };
  });

  afterAll(async () => await clearDatabase(module));

  it('should create a task', async () => {
    registeredTask = await controller.create(createTaskDto);
    expect(registeredTask.patient).toEqual(createdPatient);
    expect(registeredTask.description).toEqual(createTaskDto.description);
  });

  it('should find tasks of a patient by patient ID', async () => {
    const foundTasks = await controller.findAll(createTaskDto.patientId.toString());
    expect(foundTasks.length).toEqual(1);
  });

  it('should update a task', async () => {
    const updatedTaskData = {
      description: 'updated description',
    };
    const updatedTask = await controller.update(registeredTask.id.toString(), updatedTaskData);
    expect(updatedTask.description).toEqual(updatedTaskData.description);
  });

  it('should remove a task', async () => {
    const result = await controller.remove(registeredTask.id.toString());
    expect(result).toBeDefined();
  });
});
