import { TestingModule } from '@nestjs/testing';
import { getAppModule } from '../../test/global-setup';
import { AuthService } from './auth.service';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import { ConflictException, UnauthorizedException } from '@nestjs/common';

describe('AuthService', () => {
  let service: AuthService;
  let jwtService: JwtService;
  let prisma: PrismaService;
  let app: TestingModule;
  const createdIds: number[] = [];

  beforeAll(async () => {
    app = await getAppModule();
    service = app.get(AuthService);
    jwtService = app.get(JwtService);
    prisma = app.get(PrismaService);
  }, 10000);

  afterAll(async () => {
    await Promise.all(
      createdIds.map(async (id) => {
        try {
          await prisma.user.delete({ where: { id } });
        } catch {}
      }),
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('signUp / token validation / signIn', async () => {
    const email = `test-single-${Date.now()}@example.com`;
    const password = 'Test@1234';
    const name = 'Test Single User';

    const signUpRes = await service.signUp({ email, password, name } as any);
    expect(signUpRes.access_token).toBeDefined();

    const payloadUp = await jwtService.verifyAsync(signUpRes.access_token);
    expect(payloadUp.sub).toBeDefined();
    expect(payloadUp.email).toBe(email);
    createdIds.push(payloadUp.sub);

    const signInRes = await service.signIn(email, password);
    expect(signInRes.access_token).toBeDefined();

    const payloadIn = await jwtService.verifyAsync(signInRes.access_token);
    expect(payloadIn.sub).toBe(payloadUp.sub);
    expect(payloadIn.email).toBe(email);
  });

  it('handles errors: duplicate signUp and invalid signIn', async () => {
    const email = `test-error-${Date.now()}@example.com`;
    const password = 'Test@1234';
    const wrongPassword = 'wrongpass';
    const name = 'Test Error User';

    const signUpRes = await service.signUp({ email, password, name } as any);
    const payload = await jwtService.verifyAsync(signUpRes.access_token);
    createdIds.push(payload.sub);

    await expect(
      service.signUp({ email, password, name } as any),
    ).rejects.toThrow(ConflictException);

    await expect(service.signIn(email, wrongPassword)).rejects.toThrow(
      UnauthorizedException,
    );

    await expect(
      service.signIn('nonexistent@example.com', password),
    ).rejects.toThrow(UnauthorizedException);
  });

  it('signUp many and check user count', async () => {
    const countToCreate = 10;
    const baseTime = Date.now();

    for (let i = 0; i < countToCreate; i++) {
      const email = `test-many-${baseTime}-${i}@example.com`;
      const password = 'Test@1234';
      const name = `Test User ${i}`;

      const res = await service.signUp({ email, password, name } as any);
      expect(res.access_token).toBeDefined();

      const payload = await jwtService.verifyAsync(res.access_token);
      expect(payload.sub).toBeDefined();
      expect(payload.email).toBe(email);

      createdIds.push(payload.sub);
    }

    const all = await prisma.user.findMany();
    expect(all.length).toBeGreaterThanOrEqual(countToCreate);
  });
});