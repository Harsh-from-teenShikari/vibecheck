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
        createdAt: Date;
        status: import("@prisma/client").$Enums.PayoutStatus;
        creatorId: string;
        amount: number;
        currency: string;
        processedAt: Date | null;
    }>;
    handlePayoutConfirmation(event: any): Promise<void>;
    getPayoutHistory(userId: string): Promise<{
        id: string;
        createdAt: Date;
        status: import("@prisma/client").$Enums.PayoutStatus;
        creatorId: string;
        amount: number;
        currency: string;
        processedAt: Date | null;
    }[]>;
}
