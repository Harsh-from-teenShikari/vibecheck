import { Injectable, Logger } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { CreateCampaignDto } from './dto/create-campaign.dto';

@Injectable()
export class CampaignService {
    private readonly logger = new Logger(CampaignService.name);

    constructor(private prisma: DatabaseService) { }

    async createCampaign(dto: CreateCampaignDto) {
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
                status: 'draft', // Campaigns always start in draft mode
            },
        });
    }

    async activateCampaign(campaignId: string) {
        this.logger.log(`Activating Campaign: ${campaignId}`);

        return await this.prisma.campaign.update({
            where: { id: campaignId },
            data: { status: 'active' },
        });
    }

    async pauseCampaign(campaignId: string) {
        this.logger.log(`Pausing Campaign: ${campaignId}`);

        return await this.prisma.campaign.update({
            where: { id: campaignId },
            data: { status: 'paused' },
        });
    }

    async getCampaignDetails(campaignId: string) {
        return await this.prisma.campaign.findUniqueOrThrow({
            where: { id: campaignId },
        });
    }

    async getAllCampaigns() {
        return await this.prisma.campaign.findMany({
            orderBy: { createdAt: 'desc' }
        });
    }
}
