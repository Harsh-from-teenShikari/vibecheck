import { Controller, Get, Post, Patch, Body, Param, UsePipes, ValidationPipe } from '@nestjs/common';
import { CampaignService } from './campaign.service';
import { CreateCampaignDto } from './dto/create-campaign.dto';
import { UpdateCampaignDto } from './dto/update-campaign.dto';

@Controller('campaign')
export class CampaignController {
    constructor(private readonly campaignService: CampaignService) { }

    @Get()
    async getAllCampaigns() {
        return await this.campaignService.getAllCampaigns();
    }

    @Get(':id')
    async getCampaignDetails(@Param('id') id: string) {
        return await this.campaignService.getCampaignDetails(id);
    }

    @Post()
    @UsePipes(new ValidationPipe({ transform: true }))
    async createCampaign(@Body() createCampaignDto: CreateCampaignDto) {
        return await this.campaignService.createCampaign(createCampaignDto);
    }

    @Patch(':id')
    @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
    async updateCampaign(@Param('id') id: string, @Body() updateCampaignDto: UpdateCampaignDto) {
        return await this.campaignService.updateCampaign(id, updateCampaignDto);
    }

    @Patch(':id/activate')
    async activateCampaign(@Param('id') id: string) {
        return await this.campaignService.activateCampaign(id);
    }

    @Patch(':id/pause')
    async pauseCampaign(@Param('id') id: string) {
        return await this.campaignService.pauseCampaign(id);
    }

    @Post(':id/join')
    async joinCampaign(
        @Param('id') campaignId: string,
        @Body('creatorId') creatorId: string
    ) {
        return await this.campaignService.joinCampaign(campaignId, creatorId);
    }
}
