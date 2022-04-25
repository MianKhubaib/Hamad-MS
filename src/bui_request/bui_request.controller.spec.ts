import { Test, TestingModule } from '@nestjs/testing';
import { BuiRequestController } from './bui_request.controller';

describe('RequestController', () => {
  let controller: BuiRequestController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BuiRequestController],
    }).compile();

    controller = module.get<BuiRequestController>(BuiRequestController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
