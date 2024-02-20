import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { User } from './entities/user.entity';
import { UsersModule } from './users.module';
import { UsersController } from './users.controller';
import { DBConfig } from '../config/dg.config';
describe('UsersController', () => {
  let controller: UsersController;
  let module: TestingModule;
  let registeredUser: User;
  const repo = TypeOrmModule.forFeature([User]);

  const newUser = {
    email: 'test@test.com',
    password: (Math.random() * 100000).toFixed(),
    name: 'test',
  };

  beforeAll(async () => {
    module = await Test.createTestingModule({
      imports: [DBConfig, repo, UsersModule],
      controllers: [UsersController],
    }).compile();

    controller = module.get<UsersController>(UsersController);
  });

  afterAll(async () => {
    module.get(DataSource).createQueryBuilder().delete().from(User).execute();
  });

  it('should register a user', async () => {
    registeredUser = await controller.create(newUser);
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
