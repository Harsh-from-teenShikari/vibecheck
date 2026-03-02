import { ClientKafka } from '@nestjs/microservices';
import { DatabaseService } from '../database/database.service';
import { CreateSubmissionDto } from './dto/create-submission.dto';
export declare class SubmissionService {
    private prisma;
    private readonly kafkaClient;
    private readonly logger;
    constructor(prisma: DatabaseService, kafkaClient: ClientKafka);
    onModuleInit(): Promise<void>;
    createSubmission(dto: CreateSubmissionDto): Promise<{
        id: string;
        status: import("@prisma/client").$Enums.SubmissionStatus;
        createdAt: Date;
        updatedAt: Date;
        deterministicPassed: boolean;
        aiConfidence: number | null;
        aiCompliance: boolean | null;
        fraudScore: number;
        contentData: import("@prisma/client/runtime/client").JsonValue;
        campaignId: string;
        creatorId: string;
    }>;
    getCreatorSubmissions(): Promise<{
        id: string;
        status: import("@prisma/client").$Enums.SubmissionStatus;
        createdAt: Date;
        updatedAt: Date;
        deterministicPassed: boolean;
        aiConfidence: number | null;
        aiCompliance: boolean | null;
        fraudScore: number;
        contentData: import("@prisma/client/runtime/client").JsonValue;
        campaignId: string;
        creatorId: string;
    }[]>;
    getFlaggedSubmissions(): Promise<({
        campaign: {
            name: string;
        };
        creator: {
            region: string;
            user: {
                email: string;
            };
        };
    } & {
        id: string;
        status: import("@prisma/client").$Enums.SubmissionStatus;
        createdAt: Date;
        updatedAt: Date;
        deterministicPassed: boolean;
        aiConfidence: number | null;
        aiCompliance: boolean | null;
        fraudScore: number;
        contentData: import("@prisma/client/runtime/client").JsonValue;
        campaignId: string;
        creatorId: string;
    })[]>;
    verifySubmission(id: string, status: 'approved' | 'rejected'): Promise<{
        id: string;
        status: import("@prisma/client").$Enums.SubmissionStatus;
        createdAt: Date;
        updatedAt: Date;
        deterministicPassed: boolean;
        aiConfidence: number | null;
        aiCompliance: boolean | null;
        fraudScore: number;
        contentData: import("@prisma/client/runtime/client").JsonValue;
        campaignId: string;
        creatorId: string;
    }>;
}
