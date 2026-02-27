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
        fraudScore: number;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: import("@prisma/client").$Enums.SubmissionStatus;
        campaignId: string;
        creatorId: string;
        contentData: import("@prisma/client/runtime/client").JsonValue;
        deterministicPassed: boolean;
        aiConfidence: number | null;
        aiCompliance: boolean | null;
    }>;
}
