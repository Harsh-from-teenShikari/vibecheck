import { Injectable, Logger } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { CreateCampaignDto } from './dto/create-campaign.dto';
import { UpdateCampaignDto } from './dto/update-campaign.dto';

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

    async updateCampaign(campaignId: string, dto: UpdateCampaignDto) {
        this.logger.log(`Updating Campaign: ${campaignId}`);
        return await this.prisma.campaign.update({
            where: { id: campaignId },
            data: dto,
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
            orderBy: { createdAt: 'desc' },
            include: {
                _count: {
                    select: { participants: true, submissions: true }
                }
            }
        });
    }

    async joinCampaign(campaignId: string, creatorId: string) {
        this.logger.log(`Creator ${creatorId} joining Campaign ${campaignId}`);

        // Prevent duplicate joins via Prisma UPSERT or let the Unique constraint catch it
        // We'll use a simple create and let the DB throw if they already joined, or we can check first:
        const existing = await this.prisma.campaignParticipant.findUnique({
            where: {
                campaignId_creatorId: {
                    campaignId,
                    creatorId
                }
            }
        });

        if (existing) {
            return existing; // Already joined, return the existing record idempotently
        }

        return await this.prisma.campaignParticipant.create({
            data: {
                campaignId,
                creatorId
            }
        });
    }
}
