import { DatabaseService } from '../database/database.service';
import { ClientKafka } from '@nestjs/microservices';
import { ProcessCommissionDto } from './dto/commission.dto';
export declare class CommissionService {
    private prisma;
    private readonly kafkaClient;
    private readonly logger;
    constructor(prisma: DatabaseService, kafkaClient: ClientKafka);
    evaluateAndProcessCommission(dto: ProcessCommissionDto): Promise<void>;
}
