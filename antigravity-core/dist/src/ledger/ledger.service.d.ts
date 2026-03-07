import { DatabaseService } from '../database/database.service';
import { RecordCommissionDto, GeneratePayoutDto } from './dto/ledger-events.dto';
export declare class LedgerService {
    private prisma;
    private readonly logger;
    constructor(prisma: DatabaseService);
    recordCommission(dto: RecordCommissionDto): Promise<import("@prisma/client").Prisma.BatchPayload>;
    getAccountBalance(accountName: string): Promise<number>;
    processPayout(dto: GeneratePayoutDto): Promise<import("@prisma/client").Prisma.BatchPayload>;
}
