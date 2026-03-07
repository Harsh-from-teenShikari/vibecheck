import { Module } from '@nestjs/common';
import { DatabaseModule } from '../database/database.module';
import { NotificationModule } from '../notification/notification.module';
import { FraudService } from './fraud.service';
import { FraudController } from './fraud.controller';

@Module({
  imports: [DatabaseModule, NotificationModule],
  controllers: [FraudController],
  providers: [FraudService],
  exports: [FraudService]
})
export class FraudModule { }
