import { Controller, Logger } from '@nestjs/common';
import { FraudService } from './fraud.service';

@Controller('fraud')
export class FraudController {
    private readonly logger = new Logger(FraudController.name);

    constructor(private readonly fraudService: FraudService) { }
}
