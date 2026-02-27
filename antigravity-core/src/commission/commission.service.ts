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

        const submission = await this.prisma.submission.findUniqueOrThrow({
            where: { id: dto.submissionId },
            include: { campaign: true, creator: true, fraudScores: true },
        });

        // We must have an AI approval AND a Fraud Score calculated
        if (submission.status !== 'approved') {
            this.logger.log(`Submission ${submission.id} is not approved by AI.`);
            return;
        }

        if (submission.fraudScores.length === 0) {
            this.logger.log(`Submission ${submission.id} is pending Fraud completion.`);
            return;
        }

        const latestFraudScore = submission.fraudScores[submission.fraudScores.length - 1].score;

        if (latestFraudScore > 0.5) {
            this.logger.warn(`Submission ${submission.id} rejected by Commission Engine due to high Fraud Score: ${latestFraudScore}`);
            return;
        }

        // Calculate Base Reward + Dynamic Multiplier based on Trust
        const baseReward = submission.campaign.rewardPool ? (submission.campaign.rewardPool / 1000) : 1000; // Simulated flat payout if no pool
        const trustMultiplier = submission.creator.trustScore > 0.8 ? 1.5 : 1.0;
        const finalAmount = Math.floor(baseReward * trustMultiplier);

        // Save Commission Record
        const commission = await this.prisma.commission.create({
            data: {
                submissionId: submission.id,
                campaignId: submission.campaignId,
                creatorId: submission.creatorId,
                amount: finalAmount,
                currency: 'USD',
            }
        });

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
