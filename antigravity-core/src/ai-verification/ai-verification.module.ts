import { Module } from '@nestjs/common';
import { AiVerificationService } from './ai-verification.service';
import { AiVerificationController } from './ai-verification.controller';
import { DatabaseModule } from '../database/database.module';

@Module({
  imports: [DatabaseModule],
  controllers: [AiVerificationController],
  providers: [AiVerificationService],
  exports: [AiVerificationService]
})
export class AiVerificationModule { }
