import { Module } from '@nestjs/common';
import { SubmissionService } from './submission.service';
import { SubmissionController } from './submission.controller';
import { DatabaseModule } from '../database/database.module';
import { AiVerificationModule } from '../ai-verification/ai-verification.module';
import { CommissionModule } from '../commission/commission.module';

@Module({
  imports: [DatabaseModule, AiVerificationModule, CommissionModule],
  controllers: [SubmissionController],
  providers: [SubmissionService],
  exports: [SubmissionService]
})
export class SubmissionModule { }
