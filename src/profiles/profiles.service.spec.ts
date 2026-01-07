import { TestingModule } from '@nestjs/testing';
import { getAppModule } from '../../test/global-setup';
import { ProfilesService } from './profiles.service';
import { PrismaService } from '../prisma/prisma.service';

describe('ProfilesService', () => {
  let service: ProfilesService;
  let prisma: PrismaService;
  let app: TestingModule;
  const createdUserIds: number[] = [];

  beforeAll(async () => {
    app = await getAppModule();
    service = app.get(ProfilesService);
    prisma = app.get(PrismaService);
  });

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

  it('create / findOne / update / remove', async () => {
    const user = await prisma.user.create({
      data: {
        email: `test-single-${Date.now()}@example.com`,
        password: '12312asdozkxmco!J@()*J',
      },
    });
    createdUserIds.push(user.id);
    const userId = user.id;

    await service.create({ userId });

    const found = await service.findOne(userId);
    expect(found).toBeDefined();
    expect(found!.userId).toBe(userId);
    expect(found!.firstName).toBeNull();
    expect(found!.lastName).toBeNull();
    expect(found!.telegramId).toBeNull();

    const updated = await service.update(userId, { firstName: 'updated' });
    expect(updated).toBeDefined();
    expect(updated!.firstName).toBe('updated');

    const removed = await service.remove(userId);
    expect(removed).toBeDefined();
    expect(removed!.userId).toBe(userId);

    await prisma.user.delete({ where: { id: userId } });

    const idx = createdUserIds.indexOf(userId);
    if (idx !== -1) createdUserIds.splice(idx, 1);
  });

  it('create many and check count', async () => {
    const countToCreate = 10;
    for (let i = 0; i < countToCreate; i++) {
      const user = await prisma.user.create({
        data: {
          email: `test-many-${Date.now()}-${i}@example.com`,
          password: `Test User ${i}12 12A! `,
        },
      });
      createdUserIds.push(user.id);

      await service.create({ userId: user.id });
    }

    const all = await prisma.profile.findMany();
    expect(all.length).toBeGreaterThanOrEqual(countToCreate);
  });
});
