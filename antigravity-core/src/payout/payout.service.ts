import { Injectable, Logger, Inject, BadRequestException } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { ClientKafka } from '@nestjs/microservices';
import { CreatePayoutDto } from './dto/payout.dto';

@Injectable()
export class PayoutService {
    private readonly logger = new Logger(PayoutService.name);

    constructor(
        private prisma: DatabaseService,
        @Inject('KAFKA_SERVICE') private readonly kafkaClient: ClientKafka,
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

        this.logger.log(`Payout Record Stored: ${payout.id}. Emitting PayoutRequested to Ledger.`);

        // Tell Ledger to move the physical money based on its immutability logic
        this.kafkaClient.emit('PayoutRequested', {
            payoutId: payout.id,
            creatorId: payout.creatorId,
            amount: payout.amount,
            timestamp: new Date().toISOString()
        });

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
}
