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
var IdentityService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.IdentityService = void 0;
const common_1 = require("@nestjs/common");
const database_service_1 = require("../database/database.service");
const ledger_service_1 = require("../ledger/ledger.service");
let IdentityService = IdentityService_1 = class IdentityService {
    prisma;
    ledgerService;
    logger = new common_1.Logger(IdentityService_1.name);
    constructor(prisma, ledgerService) {
        this.prisma = prisma;
        this.ledgerService = ledgerService;
    }
    async createUser(dto) {
        this.logger.log(`Creating generalized User: ${dto.email}`);
        return await this.prisma.user.create({
            data: {
                email: dto.email,
                role: dto.role,
            },
        });
    }
    async getUserByEmail(email) {
        return await this.prisma.user.findUnique({
            where: { email }
        });
    }
    async createCreatorProfile(dto) {
        this.logger.log(`Provisioning Creator Profile for User: ${dto.userId}`);
        return await this.prisma.creatorProfile.create({
            data: {
                userId: dto.userId,
                niche: dto.niche,
                region: dto.region,
                followers: dto.followers,
                trustScore: 0.5,
            },
        });
    }
    async getCreatorTrustScore(creatorId) {
        const profile = await this.prisma.creatorProfile.findUniqueOrThrow({
            where: { id: creatorId },
            select: { trustScore: true },
        });
        return profile.trustScore;
    }
    async getAllUsers() {
        return await this.prisma.creatorProfile.findMany({
            include: {
                user: { select: { email: true, role: true } },
            },
            orderBy: { createdAt: 'desc' }
        });
    }
    async getCreatorDashboardMetrics(creatorId) {
        this.logger.log(`Aggregating Dashboard Metrics for Creator: ${creatorId}`);
        const balance = await this.ledgerService.getAccountBalance(`payable:creator:${creatorId}`);
        const profile = await this.prisma.creatorProfile.findUnique({
            where: { id: creatorId },
            select: { trustScore: true }
        });
        const pendingCount = await this.prisma.submission.count({
            where: {
                creatorId,
                status: {
                    in: ['pending', 'under_review']
                }
            }
        });
        const totalSubmissions = await this.prisma.submission.count({ where: { creatorId } });
        const approvedSubmissions = await this.prisma.submission.count({
            where: { creatorId, status: 'approved' }
        });
        const conversionRate = totalSubmissions > 0 ? (approvedSubmissions / totalSubmissions) * 100 : 0;
        const recentSubmissions = await this.prisma.submission.findMany({
            where: { creatorId },
            orderBy: { createdAt: 'desc' },
            take: 4,
            include: { campaign: { select: { name: true } } }
        });
        const activity = recentSubmissions.map(sub => ({
            id: sub.id,
            type: 'Submission ' + (sub.status.charAt(0).toUpperCase() + sub.status.slice(1)),
            details: `Campaign: ${sub.campaign.name}`,
            amount: sub.status === 'approved' ? `+$${(sub.fraudScore < 0.3 ? 20 : 0)}` : '-',
            time: sub.createdAt.toISOString()
        }));
        const joinedCampaigns = await this.prisma.campaignParticipant.findMany({
            where: { creatorId },
            include: {
                campaign: {
                    select: {
                        id: true,
                        name: true,
                        type: true,
                        rewardPool: true,
                    }
                }
            },
            take: 3
        });
        return {
            availableBalance: balance,
            pendingApprovals: pendingCount,
            trustScore: Number((profile?.trustScore || 0).toFixed(2)),
            conversionRate: Number(conversionRate.toFixed(1)),
            recentActivity: activity,
            activeCampaigns: joinedCampaigns.map(jc => ({
                id: jc.campaign.id,
                name: jc.campaign.name,
                type: jc.campaign.type,
                rewardPool: jc.campaign.rewardPool
            }))
        };
    }
};
exports.IdentityService = IdentityService;
exports.IdentityService = IdentityService = IdentityService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [database_service_1.DatabaseService,
        ledger_service_1.LedgerService])
], IdentityService);
//# sourceMappingURL=identity.service.js.map