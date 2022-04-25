import { Test, TestingModule } from '@nestjs/testing';
import { BuiRequestService } from './bui_request.service';

describe('RequestService', () => {
  let service: BuiRequestService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BuiRequestService],
    }).compile();

    service = module.get<BuiRequestService>(BuiRequestService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
