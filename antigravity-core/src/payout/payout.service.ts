import { Injectable, Logger, BadRequestException } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { LedgerService } from '../ledger/ledger.service';
import { NotificationService } from '../notification/notification.service';
import { CreatePayoutDto } from './dto/payout.dto';

@Injectable()
export class PayoutService {
    private readonly logger = new Logger(PayoutService.name);

    constructor(
        private prisma: DatabaseService,
        private readonly ledgerService: LedgerService,
        private readonly notificationService: NotificationService,
    ) { }

    /**
     * Doctrine 5: Legal Compliance Doctrine
     * Triggers a payout if KYC is verified. Moves state to pending, emits to Ledger.
     */
    async requestPayout(dto: CreatePayoutDto) {
        this.logger.log(`Initiating Payout Request for Creator: ${dto.creatorId}`);

        // Fetch KYC Status
        const creator = await this.prisma.creatorProfile.findUniqueOrThrow({
            where: { id: dto.creatorId },
            select: { kycStatus: true, taxProfileId: true }
        });

        if (creator.kycStatus !== 'verified') {
            throw new BadRequestException('PAYOUT_FAILED: KYC Status not verified.');
        }

        if (!creator.taxProfileId) {
            throw new BadRequestException('PAYOUT_FAILED: Tax Profile missing.');
        }

        // Provision Payout DB Record
        const payout = await this.prisma.payout.create({
            data: {
                creatorId: dto.creatorId,
                amount: dto.amount,
                currency: 'USD',
                status: 'pending',
            }
        });

        this.logger.log(`Payout Record Stored: ${payout.id}. Requesting physical payout from Ledger.`);

        // Tell Ledger to move the physical money based on its immutability logic
        await this.ledgerService.processPayout({
            payoutId: payout.id,
            creatorId: payout.creatorId,
            amount: payout.amount,
        });

        // Normally, handlePayoutConfirmation would be called by a webhook from a payment provider like Stripe
        // But for our simplified synchronous architecture we can directly update it here.
        await this.handlePayoutConfirmation({
            payoutId: payout.id,
            status: 'completed',
        });

        // Doctrine 2: Synchronous Notification Dispatch
        await this.notificationService.notifyCreator(
            payout.creatorId,
            'Your Payout is Complete',
            `We have successfully processed a payout of ${payout.amount} USD cents.`
        );

        return payout;
    }

    /**
     * Listens to Ledger Confirmation Events
     */
    async handlePayoutConfirmation(event: any) {
        this.logger.log(`Payout Confirmation Received from Ledger: ${event.payoutId}`);

        await this.prisma.payout.update({
            where: { id: event.payoutId },
            data: {
                status: event.status, // e.g. 'completed'
                processedAt: new Date()
            }
        });
    }

    async getPayoutHistory(userId: string) {
        // Resolve CreatorProfile from User ID
        const profile = await this.prisma.creatorProfile.findUnique({
            where: { userId }
        });

        if (!profile) return [];

        return await this.prisma.payout.findMany({
            where: { creatorId: profile.id },
            orderBy: { createdAt: 'desc' }
        });
    }
}
