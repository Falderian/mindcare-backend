import { TestingModule } from '@nestjs/testing';
import { getAppModule } from '../../test/global-setup';
import { UsersService } from './users.service';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';

describe('UsersService', () => {
  let service: UsersService;
  let prisma: PrismaService;
  let app: TestingModule;

  const createdUserIds: number[] = [];

  beforeAll(async () => {
    app = await getAppModule();
    service = app.get(UsersService);
    prisma = app.get(PrismaService);
  }, 10000);

  afterAll(async () => {
    await Promise.all(
      createdUserIds.map(async (id) => {
        try {
          await prisma.user.delete({ where: { id } });
        } catch {}
      }),
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('create / findByEmail / remove', async () => {
    const email = `test-single-${Date.now()}@example.com`;
    const passwordHash = await bcrypt.hash('Test@1234', 10);

    const created = await service.create({
      email,
      password: passwordHash,
    });
    expect(created).toBeDefined();
    expect(created.id).toBeDefined();
    expect(created.email).toBe(email);
    createdUserIds.push(created.id);

    const found = await service.findByEmail(email);
    expect(found).toBeDefined();
    expect(found?.id).toBe(created.id);
    expect(found?.email).toBe(email);

    // Verify profile was automatically created (with retry for async side-effect)
    let profile = await prisma.profile.findUnique({
      where: { userId: created.id },
    });
    let attempts = 0;
    while (!profile && attempts < 10) {
      await new Promise((resolve) => setTimeout(resolve, 100));
      profile = await prisma.profile.findUnique({
        where: { userId: created.id },
      });
      attempts++;
    }

    expect(profile).toBeDefined();
    expect(profile!.userId).toBe(created.id);

    const removed = await service.remove(created.id);
    expect(removed).toBeDefined();
    expect(removed.id).toBe(created.id);
  });

  it('create many and check count', async () => {
    const countToCreate = 10;
    const passwordHash = await bcrypt.hash('Test@1234', 10);

    for (let i = 0; i < countToCreate; i++) {
      const email = `test-many-${Date.now()}-${i}@example.com`;

      const created = await service.create({
        email,
        password: passwordHash,
      });
      expect(created).toBeDefined();
      expect(created.id).toBeDefined();
      expect(created.email).toBe(email);

      createdUserIds.push(created.id);
    }

    // Small delay to allow all background profile creations to complete
    await new Promise((resolve) => setTimeout(resolve, 500));

    const allUsers = await prisma.user.findMany();
    expect(allUsers.length).toBeGreaterThanOrEqual(countToCreate);

    const allProfiles = await prisma.profile.findMany();
    expect(allProfiles.length).toBeGreaterThanOrEqual(countToCreate);
  });
});
