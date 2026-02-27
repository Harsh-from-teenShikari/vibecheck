import { DatabaseService } from '../database/database.service';
import { ClientKafka } from '@nestjs/microservices';
export declare class FraudService {
    private prisma;
    private readonly kafkaClient;
    private readonly logger;
    private redisClient;
    constructor(prisma: DatabaseService, kafkaClient: ClientKafka);
    calculateFraudScore(event: any): Promise<void>;
}
