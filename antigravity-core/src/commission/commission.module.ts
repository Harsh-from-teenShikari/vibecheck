import { Module } from '@nestjs/common';
import { CommissionService } from './commission.service';
import { CommissionController } from './commission.controller';
import { DatabaseModule } from '../database/database.module';
import { LedgerModule } from '../ledger/ledger.module';

@Module({
  imports: [DatabaseModule, LedgerModule],
  controllers: [CommissionController],
  providers: [CommissionService],
  exports: [CommissionService]
})
export class CommissionModule { }
