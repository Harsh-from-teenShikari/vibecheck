import { PayoutService } from './payout.service';
import { CreatePayoutDto } from './dto/payout.dto';
export declare class PayoutController {
    private readonly payoutService;
    private readonly logger;
    constructor(payoutService: PayoutService);
    initiatePayout(body: CreatePayoutDto): Promise<{
        id: string;
        createdAt: Date;
        status: import("@prisma/client").$Enums.PayoutStatus;
        creatorId: string;
        amount: number;
        currency: string;
        processedAt: Date | null;
    }>;
    getPayoutHistory(creatorId: string): Promise<{
        id: string;
        createdAt: Date;
        status: import("@prisma/client").$Enums.PayoutStatus;
        creatorId: string;
        amount: number;
        currency: string;
        processedAt: Date | null;
    }[]>;
}
