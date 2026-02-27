import { IsString, IsNotEmpty, IsObject } from 'class-validator';

export class CreateSubmissionDto {
    @IsString()
    @IsNotEmpty()
    campaignId: string;

    @IsString()
    @IsNotEmpty()
    creatorId: string;

    @IsObject()
    @IsNotEmpty()
    contentData: Record<string, any>;
}
