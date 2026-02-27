import { Injectable, Logger, Inject } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { AiVerificationResultDto } from './dto/ai-verification.dto';
import { ClientKafka } from '@nestjs/microservices';

@Injectable()
export class AiVerificationService {
    private readonly logger = new Logger(AiVerificationService.name);

    constructor(
        private prisma: DatabaseService,
        @Inject('KAFKA_SERVICE') private readonly kafkaClient: ClientKafka,
    ) { }

    /**
     * Doctrine 3: Tiered AI Verification
     * Step 1: Deterministic
     * Step 2: Eligibility
     * Step 3: Fast AI (Claude Haiku / Gemini Flash)
     * Step 4: Premium AI (GPT-4o) if confidence < threshold
     */
    async evaluateSubmission(submissionEvent: any) {
        this.logger.log(`Evaluating Submission: ${submissionEvent.submissionId}`);

        // Fetch full context for evaluation
        const submission = await this.prisma.submission.findUniqueOrThrow({
            where: { id: submissionEvent.submissionId },
            include: { campaign: true, creator: true },
        });

        // Tier 1: Deterministic & Eligibility
        const isEligible = this.checkEligibility(submission);
        if (!isEligible) {
            return this.rejectEarly(submission.id, 'Eligibility criteria not met');
        }

        // Tier 2: Mid-tier Evaluation (Mocked logic)
        let aiResult = await this.callMidTierModel(submission);

        // Tier 3: Escalation check
        if (aiResult.confidence < 0.85) {
            this.logger.warn(`Confidence threshold not met (${aiResult.confidence}). Escalating to Premium Model.`);
            aiResult = await this.callPremiumModel(submission, aiResult);
        }

        // Persist AI Report
        await this.prisma.aiVerificationReport.create({
            data: {
                submissionId: submission.id,
                modelUsed: aiResult.modelUsed,
                eligibility: aiResult.eligibility,
                compliance: aiResult.compliance,
                confidence: aiResult.confidence,
                riskFlags: aiResult.riskFlags,
                reasoning: aiResult.reasoning,
                rawOutput: { raw: "simulated_payload" }, // Cold storage targeted
            },
        });

        // Update Submission Status & Emit Completion
        const state = (aiResult.compliance && aiResult.eligibility) ? 'approved' : 'rejected';

        await this.prisma.submission.update({
            where: { id: submission.id },
            data: {
                status: state,
                aiConfidence: aiResult.confidence,
                aiCompliance: aiResult.compliance,
                deterministicPassed: true,
            }
        });

        this.logger.log(`Submission ${submission.id} evaluated. State: ${state}`);

        this.kafkaClient.emit('VerificationCompleted', {
            submissionId: submission.id,
            state: state,
            aiConfidence: aiResult.confidence,
            creatorId: submission.creatorId,
            campaignId: submission.campaignId,
        });
    }

    private checkEligibility(submission: any): boolean {
        if (submission.creator.followers < submission.campaign.minFollowers) return false;
        if (submission.creator.region !== submission.campaign.region) return false;
        return true;
    }

    private async callMidTierModel(context: any): Promise<AiVerificationResultDto> {
        // Simulate Gemini Flash / Claude Haiku API
        return {
            modelUsed: 'gemini-1.5-flash',
            eligibility: true,
            compliance: true,
            confidence: 0.82, // Forces escalation in this mock run
            riskFlags: [],
            reasoning: ['Content appears compliant but audio match is uncertain.'],
        };
    }

    private async callPremiumModel(context: any, previousResult: any): Promise<AiVerificationResultDto> {
        // Simulate GPT-4o API
        return {
            modelUsed: 'gpt-4o',
            eligibility: true,
            compliance: true,
            confidence: 0.98,
            riskFlags: [],
            reasoning: ['Audio matched dynamically via multimodal parsing. Fully compliant.'],
        };
    }

    private async rejectEarly(submissionId: string, reason: string) {
        this.logger.log(`Rejecting Submission ${submissionId} Early: ${reason}`);

        await this.prisma.submission.update({
            where: { id: submissionId },
            data: { status: 'rejected', deterministicPassed: false }
        });

        this.kafkaClient.emit('VerificationCompleted', {
            submissionId,
            state: 'rejected',
            reason,
        });
    }
}
