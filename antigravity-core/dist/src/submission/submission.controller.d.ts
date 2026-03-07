import { SubmissionService } from './submission.service';
import { CreateSubmissionDto } from './dto/create-submission.dto';
export declare class SubmissionController {
    private readonly submissionService;
    constructor(submissionService: SubmissionService);
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
    createSubmission(createSubmissionDto: CreateSubmissionDto): Promise<{
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
