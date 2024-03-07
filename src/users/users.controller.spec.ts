import { TestingModule } from '@nestjs/testing';
import { UserRole } from './entities/user.entity';
import { UsersController } from './users.controller';
import { clearDatabase, createUser, setupTestingModule } from '../utils/testUtils';
import { Patient } from '../patients/entities/patient.entity';

describe('UsersController', () => {
  let controller: UsersController;
  let module: TestingModule;
  let registeredUser: {
    id: any;
    email?: string;
    name?: string;
    password?: string;
    role?: UserRole;
    createdAt?: Date;
    updatedAt?: Date;
    patient?: Patient;
  };

  beforeAll(async () => {
    module = await setupTestingModule();
    controller = module.get<UsersController>(UsersController);
  });

  afterAll(async () => await clearDatabase(module));

  it('should register a user', async () => {
    const newUser = {
      email: 'user@user.com',
      password: (Math.random() * 100000).toFixed(),
      name: 'test',
    };

    registeredUser = await createUser(module, newUser);
    expect(registeredUser.email).toBe(newUser.email);
    expect(registeredUser.id).not.toBeNull();
  });

  it('should find one user by id', async () => {
    const foundUser = await controller.findOne(registeredUser.id.toString());
    expect(foundUser.email).toEqual(registeredUser.email);
  });

  it('should update a user', async () => {
    const updatedUserData = { name: 'Updated Name' };
    const updatedUser = await controller.update(registeredUser.id.toString(), updatedUserData);
    expect(updatedUser.name).toBe(updatedUserData.name);
  });

  it('should remove a user', async () => {
    const result = await controller.remove(registeredUser.id.toString());
    expect(result).toBe(`User with id ${registeredUser.id} has been successfully removed`);
  });
});
