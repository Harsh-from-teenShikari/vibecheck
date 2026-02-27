import { AppService } from './app.service';
import { DatabaseService } from './database/database.service';
export declare class AppController {
    private readonly appService;
    private readonly prisma;
    private readonly logger;
    constructor(appService: AppService, prisma: DatabaseService);
    getHello(): string;
    seedDb(): Promise<{
        success: boolean;
        message: string;
        error?: undefined;
    } | {
        success: boolean;
        error: any;
        message?: undefined;
    }>;
}
