import { Module } from '@nestjs/common';
import { AiVerificationService } from './ai-verification.service';
import { AiVerificationController } from './ai-verification.controller';
import { DatabaseModule } from '../database/database.module';
import { KafkaModule } from '../kafka/kafka.module';

@Module({
  imports: [DatabaseModule, KafkaModule],
  controllers: [AiVerificationController],
  providers: [AiVerificationService],
  exports: [AiVerificationService]
})
export class AiVerificationModule { }
