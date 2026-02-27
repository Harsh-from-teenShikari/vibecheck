import { Controller, Logger } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';
import { AiVerificationService } from './ai-verification.service';

@Controller()
export class AiVerificationController {
    private readonly logger = new Logger(AiVerificationController.name);

    constructor(private readonly verificationService: AiVerificationService) { }

    @EventPattern('SubmissionCreated')
    async handleSubmissionCreated(@Payload() message: any) {
        this.logger.log(`Received Event [SubmissionCreated]: ID ${message.submissionId}`);

        // Asynchronous decoupled evaluation per Event-Driven doctrine
        await this.verificationService.evaluateSubmission(message);
    }
}
