import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Task } from './entities/task.entity';
import { TasksModule } from './tasks.module';
import { TasksController } from './tasks.controller';
import { PatientsService } from '../patients/patients.service';
import { Patient } from '../patients/entities/patient.entity';
import { UsersService } from '../users/users.service';
import { User } from '../users/entities/user.entity';
import { DBConfig } from '../config/dg.config';
import { CreateTaskDto } from './dto/create-task.dto';
import { clearDatabase } from '../utils/utils';

describe('TasksController', () => {
  let controller: TasksController;
  let module: TestingModule;
  let registeredTask: Task;
  let createTaskDto: CreateTaskDto;
  let createdPatient: Patient;
  const userRepo = TypeOrmModule.forFeature([User]);
  const patientRepo = TypeOrmModule.forFeature([Patient]);
  const taskRepo = TypeOrmModule.forFeature([Task]);

  const newUser = {
    email: 'task@task.com',
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
      imports: [DBConfig, userRepo, patientRepo, taskRepo, TasksModule],
      controllers: [TasksController],
      providers: [PatientsService, UsersService],
    }).compile();

    controller = module.get<TasksController>(TasksController);

    const userService = module.get<UsersService>(UsersService);
    const registeredUser = await userService.create(newUser);

    const patientsService = module.get<PatientsService>(PatientsService);
    createdPatient = await patientsService.create({ ...createPatientDto, userId: registeredUser.id });

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
