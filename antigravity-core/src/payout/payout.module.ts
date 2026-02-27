import { Module } from '@nestjs/common';
import { DatabaseModule } from '../database/database.module';
import { KafkaModule } from '../kafka/kafka.module';
import { PayoutService } from './payout.service';
import { PayoutController } from './payout.controller';

@Module({
  imports: [DatabaseModule, KafkaModule],
  controllers: [PayoutController],
  providers: [PayoutService],
  exports: [PayoutService]
})
export class PayoutModule { }
