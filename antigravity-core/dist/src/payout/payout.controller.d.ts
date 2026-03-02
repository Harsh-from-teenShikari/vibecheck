import { PayoutService } from './payout.service';
import { CreatePayoutDto } from './dto/payout.dto';
export declare class PayoutController {
    private readonly payoutService;
    private readonly logger;
    constructor(payoutService: PayoutService);
    initiatePayout(body: CreatePayoutDto): Promise<{
        id: string;
        status: import("@prisma/client").$Enums.PayoutStatus;
        createdAt: Date;
        creatorId: string;
        amount: number;
        currency: string;
        processedAt: Date | null;
    }>;
    handlePayoutProcessed(message: any): Promise<void>;
    getPayoutHistory(creatorId: string): Promise<{
        id: string;
        status: import("@prisma/client").$Enums.PayoutStatus;
        createdAt: Date;
        creatorId: string;
        amount: number;
        currency: string;
        processedAt: Date | null;
    }[]>;
}
