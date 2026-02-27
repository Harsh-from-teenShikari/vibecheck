import { ControlPlaneService } from './control-plane.service';
export declare class ControlPlaneController {
    private readonly controlPlaneService;
    private readonly logger;
    constructor(controlPlaneService: ControlPlaneService);
    getDriftMetrics(): Promise<{
        id: string;
        campaignId: string;
        approvalRate: number;
        avgConfidence: number;
        timestamp: Date;
    }[]>;
    getAuditLogs(): Promise<{
        id: string;
        createdAt: Date;
        actorId: string;
        action: string;
        entityType: string;
        entityId: string;
        beforeState: import("@prisma/client/runtime/client").JsonValue | null;
        afterState: import("@prisma/client/runtime/client").JsonValue | null;
    }[]>;
    triggerManualOverride(body: {
        operatorId: string;
        entityId: string;
        action: string;
        justification: string;
    }): Promise<{
        id: string;
        createdAt: Date;
        actorId: string;
        action: string;
        entityType: string;
        entityId: string;
        beforeState: import("@prisma/client/runtime/client").JsonValue | null;
        afterState: import("@prisma/client/runtime/client").JsonValue | null;
    }>;
}
