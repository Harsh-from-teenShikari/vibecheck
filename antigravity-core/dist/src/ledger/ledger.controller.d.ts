import { LedgerService } from './ledger.service';
export declare class LedgerController {
    private readonly ledgerService;
    private readonly logger;
    constructor(ledgerService: LedgerService);
    handleCommissionApproved(message: any): Promise<void>;
    handlePayoutRequested(message: any): Promise<void>;
}
