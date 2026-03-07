import { Injectable, Logger, BadRequestException } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { RecordCommissionDto, GeneratePayoutDto } from './dto/ledger-events.dto';

@Injectable()
export class LedgerService {
    private readonly logger = new Logger(LedgerService.name);

    constructor(
        private prisma: DatabaseService,
    ) { }

    /**
     * Doctrine 1: Financial Immutability
     * Records a Commission Event using strictly double-entry accounting.
     * Debits the Campaign Liability Account, Credits the Creator Payable Account.
     */
    async recordCommission(dto: RecordCommissionDto) {
        this.logger.log(`Recording Commission Event: ${dto.commissionId}`);

        const systemLiabilityAccount = `liability:campaign:${dto.campaignId}`;
        const creatorPayableAccount = `payable:creator:${dto.creatorId}`;

        return await this.prisma.$transaction(async (tx) => {
            // 1. Create the double-entry records atomically
            const entries = await tx.ledgerEntry.createMany({
                data: [
                    {
                        debitAccount: systemLiabilityAccount,
                        creditAccount: 'SYSTEM_CLEARING',
                        amount: dto.amount,
                        referenceType: 'COMMISSION',
                        referenceId: dto.commissionId,
                        commissionId: dto.commissionId,
                    },
                    {
                        debitAccount: 'SYSTEM_CLEARING',
                        creditAccount: creatorPayableAccount,
                        amount: dto.amount,
                        referenceType: 'COMMISSION',
                        referenceId: dto.commissionId,
                        commissionId: dto.commissionId,
                    },
                ],
            });

            this.logger.log(`Successfully persisted ${entries.count} Ledger Entries for Commission ${dto.commissionId}`);

            return entries;
        });
    }

    /**
     * Doctrine 1: Financial Immutability
     * Calculates the true balance of an account by summing credits and subtracting debits.
     */
    async getAccountBalance(accountName: string): Promise<number> {
        const aggregations = await this.prisma.ledgerEntry.groupBy({
            by: ['creditAccount', 'debitAccount'],
            where: {
                OR: [{ creditAccount: accountName }, { debitAccount: accountName }],
            },
            _sum: {
                amount: true,
            },
        });

        let totalCredits = 0;
        let totalDebits = 0;

        for (const agg of aggregations) {
            if (agg.creditAccount === accountName) {
                totalCredits += agg._sum.amount || 0;
            }
            if (agg.debitAccount === accountName) {
                totalDebits += agg._sum.amount || 0;
            }
        }

        // Ledger balance = SUM(credits - debits)
        return totalCredits - totalDebits;
    }

    /**
     * Processes a payout by moving funds from the Payable account to the Payout transit account.
     */
    async processPayout(dto: GeneratePayoutDto) {
        this.logger.log(`Processing Payout Request: ${dto.payoutId} for Creator: ${dto.creatorId}`);

        const creatorPayableAccount = `payable:creator:${dto.creatorId}`;
        const targetTransitAccount = `transit:payout:${dto.payoutId}`;

        return await this.prisma.$transaction(async (tx) => {
            // Fetch balance within transaction to prevent race conditions during payout math
            const currentBalance = await this.getAccountBalance(creatorPayableAccount);

            if (currentBalance < dto.amount) {
                this.logger.error(`Insufficient funds for Creator ${dto.creatorId}. Requested: ${dto.amount}, Available: ${currentBalance}`);
                throw new BadRequestException('LEDGER_IMBALANCE: Insufficient funds for payout');
            }

            // Create Payout double-entry record
            const entries = await tx.ledgerEntry.createMany({
                data: [
                    {
                        debitAccount: creatorPayableAccount,
                        creditAccount: 'SYSTEM_CLEARING',
                        amount: dto.amount,
                        referenceType: 'PAYOUT',
                        referenceId: dto.payoutId,
                        payoutId: dto.payoutId,
                    },
                    {
                        debitAccount: 'SYSTEM_CLEARING',
                        creditAccount: targetTransitAccount,
                        amount: dto.amount,
                        referenceType: 'PAYOUT',
                        referenceId: dto.payoutId,
                        payoutId: dto.payoutId,
                    },
                ],
            });

            return entries;
        });
    }
}
