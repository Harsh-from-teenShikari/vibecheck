import { DatabaseService } from '../database/database.service';
import { ClientKafka } from '@nestjs/microservices';
import { RecordCommissionDto, GeneratePayoutDto } from './dto/ledger-events.dto';
export declare class LedgerService {
    private prisma;
    private readonly kafkaClient;
    private readonly logger;
    constructor(prisma: DatabaseService, kafkaClient: ClientKafka);
    recordCommission(dto: RecordCommissionDto): Promise<import("@prisma/client").Prisma.BatchPayload>;
    getAccountBalance(accountName: string): Promise<number>;
    processPayout(dto: GeneratePayoutDto): Promise<import("@prisma/client").Prisma.BatchPayload>;
}
