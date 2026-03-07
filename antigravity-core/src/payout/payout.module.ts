import { Module } from '@nestjs/common';
import { DatabaseModule } from '../database/database.module';
import { LedgerModule } from '../ledger/ledger.module';
import { NotificationModule } from '../notification/notification.module';
import { PayoutService } from './payout.service';
import { PayoutController } from './payout.controller';

@Module({
  imports: [DatabaseModule, LedgerModule, NotificationModule],
  controllers: [PayoutController],
  providers: [PayoutService],
  exports: [PayoutService]
})
export class PayoutModule { }
