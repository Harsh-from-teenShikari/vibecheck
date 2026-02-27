import { Controller, Logger } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';
import { FraudService } from './fraud.service';

@Controller()
export class FraudController {
    private readonly logger = new Logger(FraudController.name);

    constructor(private readonly fraudService: FraudService) { }

    @EventPattern('SubmissionCreated')
    async handleSubmissionCreated(@Payload() message: any) {
        this.logger.log(`Received Event [SubmissionCreated]: Evaluating Fraud velocity: ID ${message.submissionId}`);

        // Asynchronous decoupled evaluation per Event-Driven doctrine
        await this.fraudService.calculateFraudScore(message);
    }
}
