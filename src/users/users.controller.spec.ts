import * as request from 'supertest';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../app.module';
import { INestApplication } from '@nestjs/common';

describe('UsersController (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('/users (POST)', () => {
    return request(app.getHttpServer())
      .post('/users')
      .send({
        /* Provide test data for CreateUserDto */
      })
      .expect(201);
  });

  it('/users (GET)', () => {
    return request(app.getHttpServer()).get('/users').expect(200);
  });

  it('/users/:id (GET)', () => {
    const userId = '1';
    return request(app.getHttpServer()).get(`/users/${userId}`).expect(200);
  });

  it('/users/:id (PATCH)', () => {
    const userId = '1';
    return request(app.getHttpServer())
      .patch(`/users/${userId}`)
      .send({
        /* Provide test data for UpdateUserDto */
      })
      .expect(200);
  });

  it('/users/:id (DELETE)', () => {
    const userId = '1';
    return request(app.getHttpServer()).delete(`/users/${userId}`).expect(200);
  });
});
