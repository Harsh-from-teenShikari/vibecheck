import { NotificationService } from './notification.service';
export declare class NotificationController {
    private readonly notificationService;
    private readonly logger;
    constructor(notificationService: NotificationService);
    handlePayoutProcessed(message: any): Promise<void>;
    handleFraudAlerts(message: any): Promise<void>;
}
