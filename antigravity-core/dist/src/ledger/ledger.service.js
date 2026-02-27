"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var LedgerService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.LedgerService = void 0;
const common_1 = require("@nestjs/common");
const database_service_1 = require("../database/database.service");
const microservices_1 = require("@nestjs/microservices");
let LedgerService = LedgerService_1 = class LedgerService {
    prisma;
    kafkaClient;
    logger = new common_1.Logger(LedgerService_1.name);
    constructor(prisma, kafkaClient) {
        this.prisma = prisma;
        this.kafkaClient = kafkaClient;
    }
    async recordCommission(dto) {
        this.logger.log(`Recording Commission Event: ${dto.commissionId}`);
        const systemLiabilityAccount = `liability:campaign:${dto.campaignId}`;
        const creatorPayableAccount = `payable:creator:${dto.creatorId}`;
        return await this.prisma.$transaction(async (tx) => {
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
            this.kafkaClient.emit('LedgerEntryCreated', {
                commissionId: dto.commissionId,
                creatorId: dto.creatorId,
                amount: dto.amount,
                type: 'COMMISSION_RECORDED',
                timestamp: new Date().toISOString()
            });
            return entries;
        });
    }
    async getAccountBalance(accountName) {
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
        return totalCredits - totalDebits;
    }
    async processPayout(dto) {
        this.logger.log(`Processing Payout Request: ${dto.payoutId} for Creator: ${dto.creatorId}`);
        const creatorPayableAccount = `payable:creator:${dto.creatorId}`;
        const targetTransitAccount = `transit:payout:${dto.payoutId}`;
        return await this.prisma.$transaction(async (tx) => {
            const currentBalance = await this.getAccountBalance(creatorPayableAccount);
            if (currentBalance < dto.amount) {
                this.logger.error(`Insufficient funds for Creator ${dto.creatorId}. Requested: ${dto.amount}, Available: ${currentBalance}`);
                throw new common_1.BadRequestException('LEDGER_IMBALANCE: Insufficient funds for payout');
            }
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
            this.kafkaClient.emit('PayoutProcessed', {
                payoutId: dto.payoutId,
                creatorId: dto.creatorId,
                amount: dto.amount,
                status: 'completed',
                timestamp: new Date().toISOString()
            });
            return entries;
        });
    }
};
exports.LedgerService = LedgerService;
exports.LedgerService = LedgerService = LedgerService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(1, (0, common_1.Inject)('KAFKA_SERVICE')),
    __metadata("design:paramtypes", [database_service_1.DatabaseService,
        microservices_1.ClientKafka])
], LedgerService);
//# sourceMappingURL=ledger.service.js.map