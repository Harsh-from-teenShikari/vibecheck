import { Injectable, Logger, Inject } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { CreateSubmissionDto } from './dto/create-submission.dto';
import { AiVerificationService } from '../ai-verification/ai-verification.service';
import { CommissionService } from '../commission/commission.service';

@Injectable()
export class SubmissionService {
    private readonly logger = new Logger(SubmissionService.name);

    constructor(
        private prisma: DatabaseService,
        private readonly aiVerificationService: AiVerificationService,
        private readonly commissionService: CommissionService,
    ) { }

    /**
     * Synchronous Verification Doctrine
     * Saves the submission to the local datastore and immediately evaluates it.
     */
    async createSubmission(dto: CreateSubmissionDto) {
        this.logger.log(`Ingesting Submission for Campaign: ${dto.campaignId} by Creator: ${dto.creatorId}`);

        // Verify the campaign is not depleted
        const campaign = await this.prisma.campaign.findUnique({
            where: { id: dto.campaignId }
        });

        if (!campaign) {
            throw new Error('Campaign not found');
        }

        if (campaign.rewardPool !== null && campaign.rewardPool <= 0) {
            throw new Error('This campaign has exhausted its reward pool. No further submissions are accepted.');
        }

        // Persist to DB (Status defaults to pending)
        const submission = await this.prisma.submission.create({
            data: {
                campaignId: dto.campaignId,
                creatorId: dto.creatorId,
                contentData: { url: dto.contentUrl },
            },
        });

        this.logger.log(`Submission ${submission.id} persisted. Running AI Verification.`);

        // Call AI Verification synchronously
        const eventPayload = {
            submissionId: submission.id,
            campaignId: submission.campaignId,
            creatorId: submission.creatorId,
            contentData: submission.contentData,
            timestamp: new Date().toISOString()
        };

        // Execute without awaiting to mimic event-driven async behavior slightly and prevent hanging the HTTP req
        this.aiVerificationService.evaluateSubmission(eventPayload).catch(e => {
            this.logger.error(`AI Verification failed for ${submission.id}:`, e);
        });

        return submission;
    }

    async getCreatorSubmissions() {
        return await this.prisma.submission.findMany({
            orderBy: { createdAt: 'desc' }
        });
    }

    async getFlaggedSubmissions() {
        return await this.prisma.submission.findMany({
            where: {
                OR: [
                    { status: 'under_review' },
                    { fraudScore: { gt: 0.7 } }
                ]
            },
            include: {
                creator: { select: { user: { select: { email: true } }, region: true } },
                campaign: { select: { name: true } }
            },
            orderBy: { createdAt: 'desc' }
        });
    }

    async verifySubmission(id: string, status: 'approved' | 'rejected') {
        this.logger.log(`Manual Verification for Submission ${id}: ${status}`);
        const submission = await this.prisma.submission.update({
            where: { id },
            data: { status }
        });

        // Trigger Commission Engine synchronously
        if (status === 'approved') {
            await this.commissionService.evaluateAndProcessCommission({ submissionId: id });
        }

        return submission;
    }
}
