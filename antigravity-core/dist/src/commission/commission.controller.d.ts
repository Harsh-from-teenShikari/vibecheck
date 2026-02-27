import { CommissionService } from './commission.service';
export declare class CommissionController {
    private readonly commissionService;
    private readonly logger;
    constructor(commissionService: CommissionService);
    handleVerificationCompleted(message: any): Promise<void>;
    handleFraudCalculated(message: any): Promise<void>;
}
