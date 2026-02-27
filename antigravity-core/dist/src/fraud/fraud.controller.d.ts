import { FraudService } from './fraud.service';
export declare class FraudController {
    private readonly fraudService;
    private readonly logger;
    constructor(fraudService: FraudService);
    handleSubmissionCreated(message: any): Promise<void>;
}
