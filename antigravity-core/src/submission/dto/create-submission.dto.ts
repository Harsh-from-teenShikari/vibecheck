import { IsString, IsNotEmpty, IsObject } from 'class-validator';

export class CreateSubmissionDto {
    @IsString()
    @IsNotEmpty()
    campaignId: string;

    @IsString()
    @IsNotEmpty()
    creatorId: string;

    @IsString()
    @IsNotEmpty()
    contentUrl: string;
}
