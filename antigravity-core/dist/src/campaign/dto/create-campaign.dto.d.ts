import { CampaignType } from '@prisma/client';
export declare class CreateCampaignDto {
    name: string;
    type: CampaignType;
    region: string;
    minFollowers: number;
    targetNiche: string;
    requiredHashtags?: Record<string, any>;
    bannedKeywords?: Record<string, any>;
    requiredAssetId?: string;
    rewardPool?: number;
    targetMetric?: number;
    targetReward?: number;
}
