import { TestingModule } from '@nestjs/testing';
import { Patient } from '../patients/entities/patient.entity';
import { Task } from '../tasks/entities/task.entity';
import { User } from '../users/entities/user.entity';
import { DataSource, EntityTarget, ObjectLiteral } from 'typeorm';

export const clearDatabase = async (module: TestingModule) => {
  const clearTable = async (entity: EntityTarget<ObjectLiteral>) => {
    await module.get(DataSource).createQueryBuilder().delete().from(entity).execute();
  };

  await clearTable(User);
  await clearTable(Task);
  await clearTable(Patient);

  await module.close();
};
