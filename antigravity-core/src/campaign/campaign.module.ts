import { Module } from '@nestjs/common';
import { CampaignService } from './campaign.service';
import { DatabaseModule } from '../database/database.module';

@Module({
  imports: [DatabaseModule],
  providers: [CampaignService],
  exports: [CampaignService]
})
export class CampaignModule { }
