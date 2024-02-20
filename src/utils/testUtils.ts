import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from '../users/users.controller';
import { PatientsController } from '../patients/patients.controller';
import { User } from '../users/entities/user.entity';
import { EntityTarget, ObjectLiteral, DataSource } from 'typeorm';
import { AppModule } from '../app.module';

const setupTestingModule = async () => {
  return await Test.createTestingModule({
    imports: [AppModule],
  }).compile();
};

const createUser = async (module: TestingModule, userData: any) => {
  const controller = module.get<UsersController>(UsersController);
  return await controller.create(userData);
};

const createPatient = async (module: TestingModule, patientData: any) => {
  const controller = module.get<PatientsController>(PatientsController);
  return await controller.create(patientData);
};

const clearDatabase = async (module: TestingModule) => {
  const clearTable = async (entity: EntityTarget<ObjectLiteral>) => {
    await module.get(DataSource).createQueryBuilder().delete().from(entity).execute();
  };

  await clearTable(User);

  await module.close();
};

export { setupTestingModule, createPatient, createUser, clearDatabase };
