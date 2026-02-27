import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './database/database.module';
import { IdentityModule } from './identity/identity.module';
import { CampaignModule } from './campaign/campaign.module';
import { SubmissionModule } from './submission/submission.module';
import { LedgerModule } from './ledger/ledger.module';
import { AiVerificationModule } from './ai-verification/ai-verification.module';
import { FraudModule } from './fraud/fraud.module';
import { CommissionModule } from './commission/commission.module';
import { PayoutModule } from './payout/payout.module';
import { NotificationModule } from './notification/notification.module';
import { ControlPlaneModule } from './control-plane/control-plane.module';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true }), DatabaseModule, IdentityModule, CampaignModule, SubmissionModule, LedgerModule, AiVerificationModule, FraudModule, CommissionModule, PayoutModule, NotificationModule, ControlPlaneModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
