import { TestingModule } from '@nestjs/testing';
import * as bcrypt from 'bcrypt';
import { getAppModule } from '../../test/global-setup';
import { NotesService } from '../notes/notes.service';
import { PrismaService } from '../prisma/prisma.service';
import { RecommendationsService } from '../recommendations/recommendations.service';
import { AppointmentsService } from './appointments.service';

describe('AppointmentsService', () => {
  let service: AppointmentsService;
  let prisma: PrismaService;
  let notesService: NotesService;
  let recService: RecommendationsService;
  let app: TestingModule;

  const createdAppointmentIds: number[] = [];
  const createdUserIds: number[] = [];

  beforeAll(async () => {
    app = await getAppModule();
    service = app.get(AppointmentsService);
    prisma = app.get(PrismaService);
    notesService = app.get(NotesService);
    recService = app.get(RecommendationsService);
  });

  afterAll(async () => {
    await Promise.all(
      createdAppointmentIds.map(async (id) => {
        try {
          await service.remove(id);
        } catch {}
      }),
    );
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
    const passwordHash = await bcrypt.hash('Test@1234', 10);

    const user = await prisma.user.create({
      data: {
        email: `test-single-${Date.now()}@example.com`,
        password: passwordHash,
      },
    });
    createdUserIds.push(user.id);

    const apptDate = new Date('2030-01-15T10:00:00');

    const created = await service.create({
      userId: user.id,
      date: apptDate,
      mode: 'online',
    });
    expect(created.id).toBeDefined();
    expect(created.userId).toBe(user.id);
    expect(created.status).toBe('scheduled');
    expect(created.mode).toBe('online');
    expect(new Date(created.date).getHours()).toBe(10);
    expect(created.note.id).toBeDefined();
    expect(created.note.content).toBe('');
    expect(created.recommendation.id).toBeDefined();
    expect(created.recommendation.content).toBe('');

    createdAppointmentIds.push(created.id);

    const found = await service.findOne(created.id);
    expect(found).not.toBeNull();
    expect(found?.userId).toBe(user.id);
    expect(found?.status).toBe('scheduled');
    expect(new Date(found!.date).getHours()).toBe(10);

    const updated = await service.update(created.id, { status: 'completed' });
    expect(updated.userId).toBe(user.id);
    expect(updated.status).toBe('completed');

    const removed = await service.remove(created.id);
    expect(removed.id).toBe(created.id);
    expect(removed.userId).toBe(user.id);
  });

  it('create many and check count', async () => {
    const countToCreate = 10;
    const baseDate = new Date('2030-06-01T12:00:00');
    const passwordHash = await bcrypt.hash('Test@1234', 10);

    for (let i = 0; i < countToCreate; i++) {
      const user = await prisma.user.create({
        data: {
          email: `test-many-${Date.now()}-${i}@example.com`,
          password: passwordHash,
        },
      });
      createdUserIds.push(user.id);

      const apptDate = new Date(baseDate);
      apptDate.setDate(baseDate.getDate() + i);

      const created = await service.create({
        userId: user.id,
        date: apptDate,
        mode: 'online',
      });
      expect(created.id).toBeDefined();
      expect(created.userId).toBe(user.id);

      createdAppointmentIds.push(created.id);
    }

    const all = await prisma.appointment.findMany();
    expect(all.length).toBeGreaterThanOrEqual(countToCreate);
  }, 30000);

  it('findAvailableSlots works correctly', async () => {
    const testDate = new Date('2030-07-01');
    const passwordHash = await bcrypt.hash('Test@1234', 10);

    const startOfDay = new Date(testDate);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(testDate);
    endOfDay.setHours(23, 59, 59, 999);

    await prisma.appointment.deleteMany({
      where: {
        date: {
          gte: startOfDay,
          lte: endOfDay,
        },
      },
    });

    let slots = await service.findAvailableSlots(testDate);
    expect(slots).toEqual([9, 10, 11, 12, 13, 14, 15, 16, 17]);
    const user1 = await prisma.user.create({
      data: {
        email: `slot-test-1-${Date.now()}@example.com`,
        password: passwordHash,
      },
    });
    createdUserIds.push(user1.id);

    const apptDate1 = new Date('2030-07-01T10:30:00');
    const created1 = await service.create({
      userId: user1.id,
      date: apptDate1,
      mode: 'online',
    });
    createdAppointmentIds.push(created1.id);

    slots = await service.findAvailableSlots(testDate);
    expect(slots).not.toContain(10);
    expect(slots.length).toBe(8);

    const user2 = await prisma.user.create({
      data: {
        email: `slot-test-2-${Date.now()}@example.com`,
        password: passwordHash,
      },
    });
    createdUserIds.push(user2.id);

    const apptDate2 = new Date('2030-07-01T14:00:00');
    const created2 = await service.create({
      userId: user2.id,
      date: apptDate2,
      mode: 'online',
    });
    createdAppointmentIds.push(created2.id);

    slots = await service.findAvailableSlots(testDate);
    expect(slots).not.toContain(10);
    expect(slots).not.toContain(14);
    expect(slots.length).toBe(7);
  });
});
