import { Controller, Logger } from '@nestjs/common';
import { CommissionService } from './commission.service';

@Controller('commission')
export class CommissionController {
    private readonly logger = new Logger(CommissionController.name);

    constructor(private readonly commissionService: CommissionService) { }
}
