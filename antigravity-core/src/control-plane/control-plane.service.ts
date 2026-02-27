import { Injectable, Logger } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';

@Injectable()
export class ControlPlaneService {
    private readonly logger = new Logger(ControlPlaneService.name);

    constructor(private prisma: DatabaseService) { }

    /**
     * Doctrine 7: Drift & AI Stability Doctrine
     * Monitors approval rates and logs Operator Overrides.
     */
    async getSystemDriftMetrics() {
        this.logger.log(`Aggregating System Drift Metrics`);

        const metrics = await this.prisma.driftMetric.findMany({
            orderBy: { timestamp: 'desc' },
            take: 100,
        });

        return metrics;
    }

    /**
     * Doctrine 5 & 7: Audit Logger for Manual Overrides
     */
    async logOperatorOverride(operatorId: string, entityId: string, action: string, justification: string) {
        this.logger.warn(`![MANUAL OVERRIDE] Operator ${operatorId} -> Action: ${action} on ${entityId}`);

        return await this.prisma.auditLog.create({
            data: {
                actorId: operatorId,
                action: action,
                entityType: 'MANUAL_OVERRIDE',
                entityId: entityId,
                afterState: { justification }
            }
        });
    }

    async getRecentAuditLogs() {
        return await this.prisma.auditLog.findMany({
            orderBy: { createdAt: 'desc' },
            take: 50,
        });
    }
}
