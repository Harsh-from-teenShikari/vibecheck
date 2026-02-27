import { Test, TestingModule } from '@nestjs/testing';
import { ControlPlaneService } from './control-plane.service';

describe('ControlPlaneService', () => {
  let service: ControlPlaneService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ControlPlaneService],
    }).compile();

    service = module.get<ControlPlaneService>(ControlPlaneService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
