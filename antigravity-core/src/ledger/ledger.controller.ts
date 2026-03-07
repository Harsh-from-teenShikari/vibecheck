import { Controller, Logger } from '@nestjs/common';
import { LedgerService } from './ledger.service';

@Controller('ledger')
export class LedgerController {
    private readonly logger = new Logger(LedgerController.name);

    constructor(private readonly ledgerService: LedgerService) { }
}
