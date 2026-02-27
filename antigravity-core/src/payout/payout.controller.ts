import { Controller, Logger, Post, Body } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';
import { PayoutService } from './payout.service';
import { CreatePayoutDto } from './dto/payout.dto';

@Controller('payouts')
export class PayoutController {
    private readonly logger = new Logger(PayoutController.name);

    constructor(private readonly payoutService: PayoutService) { }

    @Post('request')
    async initiatePayout(@Body() body: CreatePayoutDto) {
        return await this.payoutService.requestPayout(body);
    }

    @EventPattern('PayoutProcessed')
    async handlePayoutProcessed(@Payload() message: any) {
        this.logger.log(`Ledger event caught [PayoutProcessed] for: ${message.payoutId}`);

        await this.payoutService.handlePayoutConfirmation(message);
    }
}
