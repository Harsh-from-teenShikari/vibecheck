import { DatabaseService } from '../database/database.service';
import { ProcessCommissionDto } from './dto/commission.dto';
import { LedgerService } from '../ledger/ledger.service';
export declare class CommissionService {
    private prisma;
    private readonly ledgerService;
    private readonly logger;
    constructor(prisma: DatabaseService, ledgerService: LedgerService);
    evaluateAndProcessCommission(dto: ProcessCommissionDto): Promise<void>;
}
