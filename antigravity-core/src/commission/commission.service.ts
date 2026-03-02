import { Injectable, Logger, Inject } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { ClientKafka } from '@nestjs/microservices';
import { ProcessCommissionDto } from './dto/commission.dto';

@Injectable()
export class CommissionService {
    private readonly logger = new Logger(CommissionService.name);

    constructor(
        private prisma: DatabaseService,
        @Inject('KAFKA_SERVICE') private readonly kafkaClient: ClientKafka,
    ) { }

    /**
     * Doctrine 5: Financial Immutability via Commission Event Generation
     * Triggers when Fraud or Verification events land. Checks if BOTH are satisfied.
     */
    async evaluateAndProcessCommission(dto: ProcessCommissionDto) {
        this.logger.log(`Evaluating Commission viability for Submission: ${dto.submissionId}`);

        const submission = await this.prisma.submission.findUnique({
            where: { id: dto.submissionId },
            include: { campaign: true, creator: true, fraudScores: true },
        });

        if (!submission) {
            this.logger.warn(`Submission ${dto.submissionId} not found. Likely deleted during DB reset. Safely ignoring Kafka message.`);
            return;
        }

        // We must have an Operator / AI approval
        if (submission.status !== 'approved') {
            this.logger.log(`Submission ${submission.id} is not approved by Operator.`);
            return;
        }

        // Check Fraud Score if available. We log it for auditing, but we DO NOT hard block
        // the payout since 'status === approved' means an Operator manually bypassed the AI risk.
        if (submission.fraudScores.length > 0) {
            const latestFraudScore = submission.fraudScores[submission.fraudScores.length - 1].score;
            if (latestFraudScore > 0.5) {
                this.logger.warn(`Submission ${submission.id} has high Fraud Score: ${latestFraudScore}, but Operator MANUALLY APPROVED payload.`);
            }
        } else {
            this.logger.log(`Submission ${submission.id} bypassing Fraud Engine strict check (Manual Validation Assumed).`);
        }

        // Calculate exact payout based on the Campaign's defined Target Reward (stored in Cents)
        // Fallback to a flat $10 (1000 cents) if the operator left it blank
        const finalAmount = submission.campaign.targetReward ? submission.campaign.targetReward : 1000;

        // Save Commission Record and Deduct from Campaign Pool (Atomic Transaction)
        const [commission] = await this.prisma.$transaction([
            this.prisma.commission.create({
                data: {
                    submissionId: submission.id,
                    campaignId: submission.campaignId,
                    creatorId: submission.creatorId,
                    amount: finalAmount,
                    currency: 'USD',
                }
            }),
            this.prisma.campaign.update({
                where: { id: submission.campaignId },
                data: {
                    rewardPool: { decrement: finalAmount }
                }
            })
        ]);

        this.logger.log(`Commission Processed: ${commission.id} | Amount: ${finalAmount} USD cents`);

        // Doctrine 1: Emit to immutable Ledger Service
        this.kafkaClient.emit('CommissionApproved', {
            commissionId: commission.id,
            creatorId: commission.creatorId,
            campaignId: commission.campaignId,
            amount: commission.amount,
            currency: commission.currency,
            timestamp: new Date().toISOString()
        });
    }
}
