import { Test, TestingModule } from '@nestjs/testing';
import { AiVerificationService } from './ai-verification.service';

describe('AiVerificationService', () => {
  let service: AiVerificationService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AiVerificationService],
    }).compile();

    service = module.get<AiVerificationService>(AiVerificationService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
