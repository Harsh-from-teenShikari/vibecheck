export declare class NotificationService {
    private readonly logger;
    notifyCreator(creatorId: string, subject: string, message: string): Promise<void>;
    notifyOperatorAlert(subject: string, message: string): Promise<void>;
}
