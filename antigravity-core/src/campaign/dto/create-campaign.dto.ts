import { IsString, IsNotEmpty, IsNumber, IsEnum, IsOptional } from 'class-validator';
import { CampaignType, CampaignStatus } from '@prisma/client';

export class CreateCampaignDto {
    @IsString()
    @IsNotEmpty()
    name: string;

    @IsEnum(CampaignType)
    type: CampaignType;

    @IsString()
    region: string;

    @IsNumber()
    minFollowers: number;

    @IsString()
    targetNiche: string;

    @IsOptional()
    requiredHashtags?: Record<string, any>;

    @IsOptional()
    bannedKeywords?: Record<string, any>;

    @IsOptional()
    @IsString()
    requiredAssetId?: string;

    @IsOptional()
    @IsNumber()
    rewardPool?: number;

    @IsOptional()
    @IsNumber()
    targetMetric?: number;

    @IsOptional()
    @IsNumber()
    targetReward?: number;
}
