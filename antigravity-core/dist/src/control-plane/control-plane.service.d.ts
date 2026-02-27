import { DatabaseService } from '../database/database.service';
export declare class ControlPlaneService {
    private prisma;
    private readonly logger;
    constructor(prisma: DatabaseService);
    getSystemDriftMetrics(): Promise<{
        id: string;
        campaignId: string;
        approvalRate: number;
        avgConfidence: number;
        timestamp: Date;
    }[]>;
    logOperatorOverride(operatorId: string, entityId: string, action: string, justification: string): Promise<{
        id: string;
        createdAt: Date;
        actorId: string;
        action: string;
        entityType: string;
        entityId: string;
        beforeState: import("@prisma/client/runtime/client").JsonValue | null;
        afterState: import("@prisma/client/runtime/client").JsonValue | null;
    }>;
    getRecentAuditLogs(): Promise<{
        id: string;
        createdAt: Date;
        actorId: string;
        action: string;
        entityType: string;
        entityId: string;
        beforeState: import("@prisma/client/runtime/client").JsonValue | null;
        afterState: import("@prisma/client/runtime/client").JsonValue | null;
    }[]>;
}
