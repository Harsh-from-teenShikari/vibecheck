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
};
exports.ControlPlaneService = ControlPlaneService;
exports.ControlPlaneService = ControlPlaneService = ControlPlaneService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [database_service_1.DatabaseService])
], ControlPlaneService);
//# sourceMappingURL=control-plane.service.js.map