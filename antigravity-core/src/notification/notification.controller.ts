import { Controller, Logger } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';
import { NotificationService } from './notification.service';

@Controller()
export class NotificationController {
    private readonly logger = new Logger(NotificationController.name);

    constructor(private readonly notificationService: NotificationService) { }

    @EventPattern('PayoutProcessed')
    async handlePayoutProcessed(@Payload() message: any) {
        this.logger.log(`Received [PayoutProcessed] for Notification Dispatch`);

        await this.notificationService.notifyCreator(
            message.creatorId,
            'Your Payout is Complete',
            `We have successfully processed a payout of ${message.amount} USD cents.`
        );
    }

    @EventPattern('FraudScoreCalculated')
    async handleFraudAlerts(@Payload() message: any) {
        if (message.fraudScore > 0.8) {
            await this.notificationService.notifyOperatorAlert(
                'High Fraud Score Detected',
                `Creator ${message.creatorId} scored ${message.fraudScore} on Submission ${message.submissionId}.`
            );
        }
    }
}
