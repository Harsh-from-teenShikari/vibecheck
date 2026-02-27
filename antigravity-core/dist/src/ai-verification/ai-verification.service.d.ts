import { DatabaseService } from '../database/database.service';
import { ClientKafka } from '@nestjs/microservices';
export declare class AiVerificationService {
    private prisma;
    private readonly kafkaClient;
    private readonly logger;
    constructor(prisma: DatabaseService, kafkaClient: ClientKafka);
    evaluateSubmission(submissionEvent: any): Promise<void>;
    private checkEligibility;
    private callMidTierModel;
    private callPremiumModel;
    private rejectEarly;
}
