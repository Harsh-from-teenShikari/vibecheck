import { AiVerificationService } from './ai-verification.service';
export declare class AiVerificationController {
    private readonly verificationService;
    private readonly logger;
    constructor(verificationService: AiVerificationService);
    handleSubmissionCreated(message: any): Promise<void>;
}
