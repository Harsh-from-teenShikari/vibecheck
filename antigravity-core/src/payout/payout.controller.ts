import { Controller, Logger, Post, Body, Get, Param } from '@nestjs/common';
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

    @Get('history/:creatorId')
    async getPayoutHistory(@Param('creatorId') creatorId: string) {
        return await this.payoutService.getPayoutHistory(creatorId);
    }
}
