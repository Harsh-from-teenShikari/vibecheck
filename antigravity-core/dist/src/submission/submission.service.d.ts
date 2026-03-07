import { DatabaseService } from '../database/database.service';
import { CreateSubmissionDto } from './dto/create-submission.dto';
import { AiVerificationService } from '../ai-verification/ai-verification.service';
import { CommissionService } from '../commission/commission.service';
export declare class SubmissionService {
    private prisma;
    private readonly aiVerificationService;
    private readonly commissionService;
    private readonly logger;
    constructor(prisma: DatabaseService, aiVerificationService: AiVerificationService, commissionService: CommissionService);
    createSubmission(dto: CreateSubmissionDto): Promise<{
        id: string;
        status: import("@prisma/client").$Enums.SubmissionStatus;
        deterministicPassed: boolean;
        aiConfidence: number | null;
        aiCompliance: boolean | null;
        fraudScore: number;
        contentData: import("@prisma/client/runtime/client").JsonValue;
        createdAt: Date;
        updatedAt: Date;
        campaignId: string;
        creatorId: string;
    }>;
    getCreatorSubmissions(): Promise<{
        id: string;
        status: import("@prisma/client").$Enums.SubmissionStatus;
        deterministicPassed: boolean;
        aiConfidence: number | null;
        aiCompliance: boolean | null;
        fraudScore: number;
        contentData: import("@prisma/client/runtime/client").JsonValue;
        createdAt: Date;
        updatedAt: Date;
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
        deterministicPassed: boolean;
        aiConfidence: number | null;
        aiCompliance: boolean | null;
        fraudScore: number;
        contentData: import("@prisma/client/runtime/client").JsonValue;
        createdAt: Date;
        updatedAt: Date;
        campaignId: string;
        creatorId: string;
    })[]>;
    verifySubmission(id: string, status: 'approved' | 'rejected'): Promise<{
        id: string;
        status: import("@prisma/client").$Enums.SubmissionStatus;
        deterministicPassed: boolean;
        aiConfidence: number | null;
        aiCompliance: boolean | null;
        fraudScore: number;
        contentData: import("@prisma/client/runtime/client").JsonValue;
        createdAt: Date;
        updatedAt: Date;
        campaignId: string;
        creatorId: string;
    }>;
}
