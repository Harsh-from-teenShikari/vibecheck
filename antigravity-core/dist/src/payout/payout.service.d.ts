import { DatabaseService } from '../database/database.service';
import { ClientKafka } from '@nestjs/microservices';
import { CreatePayoutDto } from './dto/payout.dto';
export declare class PayoutService {
    private prisma;
    private readonly kafkaClient;
    private readonly logger;
    constructor(prisma: DatabaseService, kafkaClient: ClientKafka);
    requestPayout(dto: CreatePayoutDto): Promise<{
        id: string;
        amount: number;
        currency: string;
        status: import("@prisma/client").$Enums.PayoutStatus;
        createdAt: Date;
        processedAt: Date | null;
        creatorId: string;
    }>;
    handlePayoutConfirmation(event: any): Promise<void>;
    getPayoutHistory(userId: string): Promise<{
        id: string;
        amount: number;
        currency: string;
        status: import("@prisma/client").$Enums.PayoutStatus;
        createdAt: Date;
        processedAt: Date | null;
        creatorId: string;
    }[]>;
}
