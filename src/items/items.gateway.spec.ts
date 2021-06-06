import { Test, TestingModule } from '@nestjs/testing';
import { ItemsGateway } from './items.gateway';
import { ItemsService } from './items.service';

describe('ItemsGateway', () => {
  let gateway: ItemsGateway;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ItemsGateway, ItemsService],
    }).compile();

    gateway = module.get<ItemsGateway>(ItemsGateway);
  });

  it('should be defined', () => {
    expect(gateway).toBeDefined();
  });
});
