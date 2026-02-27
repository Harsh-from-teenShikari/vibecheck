import { Module } from '@nestjs/common';
import { SubmissionService } from './submission.service';
import { SubmissionController } from './submission.controller';
import { DatabaseModule } from '../database/database.module';
import { KafkaModule } from '../kafka/kafka.module';

@Module({
  imports: [DatabaseModule, KafkaModule],
  controllers: [SubmissionController],
  providers: [SubmissionService],
  exports: [SubmissionService]
})
export class SubmissionModule { }
