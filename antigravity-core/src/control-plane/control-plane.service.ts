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

    /**
     * Aggregates live system metrics for the Operator Dashboard
     */
    async getOperatorDashboardMetrics() {
        this.logger.log(`Aggregating Operator Dashboard Metrics`);

        // 1. Pending Verifications
        const pendingVerificationsCount = await this.prisma.submission.count({
            where: {
                status: {
                    in: ['pending', 'under_review']
                }
            }
        });

        // 2. Active Creators
        const activeCreatorsCount = await this.prisma.creatorProfile.count();

        // 3. Fraud Detection Rate (Submissions with fraudScore > 0.7 vs Total)
        const totalSubmissions = await this.prisma.submission.count();
        const flaggedSubmissions = await this.prisma.submission.count({
            where: {
                fraudScore: {
                    gte: 0.7
                }
            }
        });
        const fraudDetectionRate = totalSubmissions > 0
            ? (flaggedSubmissions / totalSubmissions) * 100
            : 0;

        // 4. Escalated Submissions
        const escalatedSubmissions = await this.prisma.submission.findMany({
            where: {
                OR: [
                    { status: 'under_review' },
                    { fraudScore: { gte: 0.7 } }
                ]
            },
            select: {
                id: true,
                fraudScore: true,
                status: true,
            },
            orderBy: { createdAt: 'desc' },
            take: 5
        });

        const mappedEscalations = escalatedSubmissions.map(sub => ({
            id: sub.id,
            risk: sub.fraudScore >= 0.9 ? 'High' : (sub.fraudScore >= 0.7 ? 'Medium' : 'Low'),
            reason: sub.fraudScore >= 0.9 ? 'High Fraud Score Detected' : 'Requires Manual AI Review'
        }));

        // 5. Recent Audit Logs
        const recentLogs = await this.prisma.auditLog.findMany({
            orderBy: { createdAt: 'desc' },
            take: 5,
            select: {
                createdAt: true,
                actorId: true,
                action: true,
                entityType: true,
                entityId: true
            }
        });

        return {
            networkLoad: Math.floor(Math.random() * 50) + 100, // Simulated network load 100-150 req/s
            pendingVerifications: pendingVerificationsCount,
            fraudDetectionRate: Number(fraudDetectionRate.toFixed(1)),
            activeCreators: activeCreatorsCount,
            escalatedSubmissions: mappedEscalations,
            recentAuditLogs: recentLogs.map(log => ({
                time: log.createdAt.toISOString(),
                actor: `Actor ${log.actorId.substring(0, 8)}`,
                action: log.action,
                entity: `${log.entityType} ${log.entityId.substring(0, 8)}`
            }))
        };
    }
}
