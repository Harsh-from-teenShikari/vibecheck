import { Module } from '@nestjs/common';
import { DatabaseModule } from '../database/database.module';
import { KafkaModule } from '../kafka/kafka.module';
import { LedgerService } from './ledger.service';
import { LedgerController } from './ledger.controller';

@Module({
    imports: [DatabaseModule, KafkaModule],
    controllers: [LedgerController],
    providers: [LedgerService],
    exports: [LedgerService]
})
export class LedgerModule { }
