import { DatabaseService } from '../database/database.service';
import { CreateCampaignDto } from './dto/create-campaign.dto';
export declare class CampaignService {
    private prisma;
    private readonly logger;
    constructor(prisma: DatabaseService);
    createCampaign(dto: CreateCampaignDto): Promise<{
        region: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        type: import("@prisma/client").$Enums.CampaignType;
        minFollowers: number;
        targetNiche: string;
        requiredHashtags: import("@prisma/client/runtime/client").JsonValue | null;
        bannedKeywords: import("@prisma/client/runtime/client").JsonValue | null;
        requiredAssetId: string | null;
        rewardPool: number | null;
        status: import("@prisma/client").$Enums.CampaignStatus;
    }>;
    activateCampaign(campaignId: string): Promise<{
        region: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        type: import("@prisma/client").$Enums.CampaignType;
        minFollowers: number;
        targetNiche: string;
        requiredHashtags: import("@prisma/client/runtime/client").JsonValue | null;
        bannedKeywords: import("@prisma/client/runtime/client").JsonValue | null;
        requiredAssetId: string | null;
        rewardPool: number | null;
        status: import("@prisma/client").$Enums.CampaignStatus;
    }>;
    pauseCampaign(campaignId: string): Promise<{
        region: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        type: import("@prisma/client").$Enums.CampaignType;
        minFollowers: number;
        targetNiche: string;
        requiredHashtags: import("@prisma/client/runtime/client").JsonValue | null;
        bannedKeywords: import("@prisma/client/runtime/client").JsonValue | null;
        requiredAssetId: string | null;
        rewardPool: number | null;
        status: import("@prisma/client").$Enums.CampaignStatus;
    }>;
    getCampaignDetails(campaignId: string): Promise<{
        region: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        type: import("@prisma/client").$Enums.CampaignType;
        minFollowers: number;
        targetNiche: string;
        requiredHashtags: import("@prisma/client/runtime/client").JsonValue | null;
        bannedKeywords: import("@prisma/client/runtime/client").JsonValue | null;
        requiredAssetId: string | null;
        rewardPool: number | null;
        status: import("@prisma/client").$Enums.CampaignStatus;
    }>;
}
