import { Module } from '@nestjs/common';
import { CommissionService } from './commission.service';
import { CommissionController } from './commission.controller';
import { DatabaseModule } from '../database/database.module';
import { KafkaModule } from '../kafka/kafka.module';

@Module({
  imports: [DatabaseModule, KafkaModule],
  controllers: [CommissionController],
  providers: [CommissionService],
  exports: [CommissionService]
})
export class CommissionModule { }
