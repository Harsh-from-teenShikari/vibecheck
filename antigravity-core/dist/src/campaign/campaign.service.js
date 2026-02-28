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
var CampaignService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.CampaignService = void 0;
const common_1 = require("@nestjs/common");
const database_service_1 = require("../database/database.service");
let CampaignService = CampaignService_1 = class CampaignService {
    prisma;
    logger = new common_1.Logger(CampaignService_1.name);
    constructor(prisma) {
        this.prisma = prisma;
    }
    async createCampaign(dto) {
        this.logger.log(`Creating new Campaign: ${dto.name} | Type: ${dto.type}`);
        return await this.prisma.campaign.create({
            data: {
                name: dto.name,
                type: dto.type,
                region: dto.region,
                minFollowers: dto.minFollowers,
                targetNiche: dto.targetNiche,
                requiredHashtags: dto.requiredHashtags,
                bannedKeywords: dto.bannedKeywords,
                requiredAssetId: dto.requiredAssetId,
                rewardPool: dto.rewardPool,
                status: 'draft',
            },
        });
    }
    async activateCampaign(campaignId) {
        this.logger.log(`Activating Campaign: ${campaignId}`);
        return await this.prisma.campaign.update({
            where: { id: campaignId },
            data: { status: 'active' },
        });
    }
    async updateCampaign(campaignId, dto) {
        this.logger.log(`Updating Campaign: ${campaignId}`);
        return await this.prisma.campaign.update({
            where: { id: campaignId },
            data: dto,
        });
    }
    async pauseCampaign(campaignId) {
        this.logger.log(`Pausing Campaign: ${campaignId}`);
        return await this.prisma.campaign.update({
            where: { id: campaignId },
            data: { status: 'paused' },
        });
    }
    async getCampaignDetails(campaignId) {
        return await this.prisma.campaign.findUniqueOrThrow({
            where: { id: campaignId },
        });
    }
    async getAllCampaigns() {
        return await this.prisma.campaign.findMany({
            orderBy: { createdAt: 'desc' },
            include: {
                _count: {
                    select: { participants: true, submissions: true }
                }
            }
        });
    }
    async joinCampaign(campaignId, creatorId) {
        this.logger.log(`Creator ${creatorId} joining Campaign ${campaignId}`);
        const existing = await this.prisma.campaignParticipant.findUnique({
            where: {
                campaignId_creatorId: {
                    campaignId,
                    creatorId
                }
            }
        });
        if (existing) {
            return existing;
        }
        return await this.prisma.campaignParticipant.create({
            data: {
                campaignId,
                creatorId
            }
        });
    }
};
exports.CampaignService = CampaignService;
exports.CampaignService = CampaignService = CampaignService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [database_service_1.DatabaseService])
], CampaignService);
//# sourceMappingURL=campaign.service.js.map