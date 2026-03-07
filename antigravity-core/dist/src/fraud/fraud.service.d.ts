import { DatabaseService } from '../database/database.service';
import { NotificationService } from '../notification/notification.service';
export declare class FraudService {
    private prisma;
    private readonly notificationService;
    private readonly logger;
    private redisClient;
    constructor(prisma: DatabaseService, notificationService: NotificationService);
    calculateFraudScore(event: any): Promise<number>;
}
