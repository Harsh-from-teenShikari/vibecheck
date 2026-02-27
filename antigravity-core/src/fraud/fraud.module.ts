import { Module } from '@nestjs/common';
import { FraudService } from './fraud.service';
import { FraudController } from './fraud.controller';
import { DatabaseModule } from '../database/database.module';
import { KafkaModule } from '../kafka/kafka.module';

@Module({
  imports: [DatabaseModule, KafkaModule],
  controllers: [FraudController],
  providers: [FraudService],
  exports: [FraudService]
})
export class FraudModule { }
