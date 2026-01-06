import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../src/app.module';

let app: TestingModule;

const initTestApp = async () => {
  if (app) return app;

  app = await Test.createTestingModule({
    imports: [AppModule],
  }).compile();

  await app.init();

  return app;
};

export const getAppModule = async () => {
  await initTestApp();
  return app;
};

export const closeTestApp = async () => {
  console.debug('closeTestApp, closeTestApp');
  if (!app) return;
  await app.close();
  app = null as any;
};
