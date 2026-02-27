import { Controller, Logger } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';
import { LedgerService } from './ledger.service';

@Controller()
export class LedgerController {
    private readonly logger = new Logger(LedgerController.name);

    constructor(private readonly ledgerService: LedgerService) { }

    @EventPattern('CommissionApproved')
    async handleCommissionApproved(@Payload() message: any) {
        this.logger.log(`Received [CommissionApproved] from Commission Engine for Commission: ${message.commissionId}`);

        await this.ledgerService.recordCommission({
            commissionId: message.commissionId,
            creatorId: message.creatorId,
            campaignId: message.campaignId,
            amount: message.amount,
        });
    }

    @EventPattern('PayoutRequested')
    async handlePayoutRequested(@Payload() message: any) {
        this.logger.log(`Received [PayoutRequested] from Payout Service for Payout: ${message.payoutId}`);

        await this.ledgerService.processPayout({
            payoutId: message.payoutId,
            creatorId: message.creatorId,
            amount: message.amount,
        });
    }
}
