import { Controller, Logger } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';
import { CommissionService } from './commission.service';

@Controller()
export class CommissionController {
    private readonly logger = new Logger(CommissionController.name);

    constructor(private readonly commissionService: CommissionService) { }

    @EventPattern('VerificationCompleted')
    async handleVerificationCompleted(@Payload() message: any) {
        this.logger.log(`Received [VerificationCompleted] Trigger for Submission: ${message.submissionId}`);

        await this.commissionService.evaluateAndProcessCommission({ submissionId: message.submissionId });
    }

    @EventPattern('FraudScoreCalculated')
    async handleFraudCalculated(@Payload() message: any) {
        this.logger.log(`Received [FraudScoreCalculated] Trigger for Submission: ${message.submissionId}`);

        await this.commissionService.evaluateAndProcessCommission({ submissionId: message.submissionId });
    }
}
