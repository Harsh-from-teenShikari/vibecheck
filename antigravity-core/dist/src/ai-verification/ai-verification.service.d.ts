import { DatabaseService } from '../database/database.service';
export declare class AiVerificationService {
    private prisma;
    private readonly logger;
    constructor(prisma: DatabaseService);
    evaluateSubmission(submissionEvent: any): Promise<void>;
    private checkEligibility;
    private callMidTierModel;
    private callPremiumModel;
    private rejectEarly;
}
