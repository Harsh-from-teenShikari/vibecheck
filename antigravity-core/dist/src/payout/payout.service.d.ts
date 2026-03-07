import { DatabaseService } from '../database/database.service';
import { LedgerService } from '../ledger/ledger.service';
import { NotificationService } from '../notification/notification.service';
import { CreatePayoutDto } from './dto/payout.dto';
export declare class PayoutService {
    private prisma;
    private readonly ledgerService;
    private readonly notificationService;
    private readonly logger;
    constructor(prisma: DatabaseService, ledgerService: LedgerService, notificationService: NotificationService);
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
