import { TestingModule } from '@nestjs/testing';
import { getAppModule } from '../../test/global-setup';
import { RecommendationsService } from './recommendations.service';

describe('RecommendationsService', () => {
  let service: RecommendationsService;
  let app: TestingModule;

  const createdIds: number[] = [];

  beforeAll(async () => {
    app = await getAppModule();
    service = app.get(RecommendationsService);
  }, 10000);

  afterAll(async () => {
    await Promise.all(createdIds.map((id) => service.remove(id)));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('create / findOne / update / remove', async () => {
    const created = await service.create();
    expect(created.id).toBeDefined();
    createdIds.push(created.id);

    const found = await service.findOne(created.id);
    expect(found).not.toBeNull();

    const updated = await service.update(created.id, { content: 'updated' });
    expect(updated.content).toBe('updated');

    const removed = await service.remove(created.id);
    expect(removed.id).toBe(created.id);

    const idx = createdIds.indexOf(created.id);
    if (idx !== -1) createdIds.splice(idx, 1);
  });

  it('create many and check findAll', async () => {
    const countToCreate = 10;

    for (let i = 0; i < countToCreate; i++) {
      const created = await service.create();
      expect(created.id).toBeDefined();
      createdIds.push(created.id);
    }

    const all = await service.findAll();
    expect(all.length).toBeGreaterThanOrEqual(countToCreate);
  });
});
