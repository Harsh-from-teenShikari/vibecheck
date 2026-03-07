"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var ControlPlaneService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ControlPlaneService = void 0;
const common_1 = require("@nestjs/common");
const database_service_1 = require("../database/database.service");
let ControlPlaneService = ControlPlaneService_1 = class ControlPlaneService {
    prisma;
    logger = new common_1.Logger(ControlPlaneService_1.name);
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getSystemDriftMetrics() {
        this.logger.log(`Aggregating System Drift Metrics`);
        const metrics = await this.prisma.driftMetric.findMany({
            orderBy: { timestamp: 'desc' },
            take: 100,
        });
        return metrics;
    }
    async logOperatorOverride(operatorId, entityId, action, justification) {
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
    async getOperatorDashboardMetrics() {
        this.logger.log(`Aggregating Operator Dashboard Metrics`);
        const pendingVerificationsCount = await this.prisma.submission.count({
            where: {
                status: {
                    in: ['pending', 'under_review']
                }
            }
        });
        const activeCreatorsCount = await this.prisma.creatorProfile.count();
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
            networkLoad: Math.floor(Math.random() * 50) + 100,
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
};
exports.ControlPlaneService = ControlPlaneService;
exports.ControlPlaneService = ControlPlaneService = ControlPlaneService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [database_service_1.DatabaseService])
], ControlPlaneService);
//# sourceMappingURL=control-plane.service.js.map