import { TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtService } from '@nestjs/jwt';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { setupTestingModule } from '../utils/testUtils';
import { UsersService } from '../users/users.service';

describe('AuthController', () => {
  let controller: AuthController;
  let authService: AuthService;
  let jwtService: JwtService;
  let usersService: UsersService;
  let module: TestingModule;

  beforeEach(async () => {
    module = await setupTestingModule();

    controller = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
    jwtService = module.get<JwtService>(JwtService);
    usersService = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('login', () => {
    it('should return an access token when login is successful', async () => {
      const user: CreateUserDto = {
        email: 'test@example.com',
        password: 'testpassword',
        name: 'Test User',
      };
      const createdUser = await usersService.create(user);
      const req = { user: createdUser };
      const result = await controller.login(req);
      expect(result.access_token).toBeDefined();
    });
  });
});
