import { Controller, Logger } from '@nestjs/common';
import { AiVerificationService } from './ai-verification.service';

@Controller('ai-verification')
export class AiVerificationController {
    private readonly logger = new Logger(AiVerificationController.name);

    constructor(private readonly verificationService: AiVerificationService) { }
}
