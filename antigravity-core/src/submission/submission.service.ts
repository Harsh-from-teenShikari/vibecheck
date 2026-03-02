import { Injectable, Logger, Inject } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { DatabaseService } from '../database/database.service';
import { CreateSubmissionDto } from './dto/create-submission.dto';

@Injectable()
export class SubmissionService {
    private readonly logger = new Logger(SubmissionService.name);

    constructor(
        private prisma: DatabaseService,
        @Inject('KAFKA_SERVICE') private readonly kafkaClient: ClientKafka,
    ) { }

    async onModuleInit() {
        this.kafkaClient.subscribeToResponseOf('SubmissionCreated');
        await this.kafkaClient.connect();
        this.logger.log('SubmissionService Kafka Client Connected');
    }

    /**
     * Doctrine 2: Event-Driven Doctrine
     * Saves the submission to the local datastore and immediately fires the Event to the broker
     * for Fraud & AI Verification Services to pick up.
     */
    async createSubmission(dto: CreateSubmissionDto) {
        this.logger.log(`Ingesting Submission for Campaign: ${dto.campaignId} by Creator: ${dto.creatorId}`);

        // Persist to DB (Status defaults to pending)
        const submission = await this.prisma.submission.create({
            data: {
                campaignId: dto.campaignId,
                creatorId: dto.creatorId,
                contentData: { url: dto.contentUrl },
            },
        });

        this.logger.log(`Submission ${submission.id} persisted. Emitting SubmissionCreated event.`);

        // Emit to Kafka for AI Verification & Fraud Services
        this.kafkaClient.emit('SubmissionCreated', {
            submissionId: submission.id,
            campaignId: submission.campaignId,
            creatorId: submission.creatorId,
            contentData: submission.contentData,
            timestamp: new Date().toISOString()
        });

        return submission;
    }

    async getCreatorSubmissions() {
        // Mock method to retrieve submissions for a hardcoded user ID.
        // In reality, this would extract the user ID from the JWT request payload.
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

        // Emit VerificationCompleted so Commission Service calculates payouts
        this.kafkaClient.emit('VerificationCompleted', {
            submissionId: id,
            state: status,
            creatorId: submission.creatorId,
            campaignId: submission.campaignId,
        });

        return submission;
    }
}
