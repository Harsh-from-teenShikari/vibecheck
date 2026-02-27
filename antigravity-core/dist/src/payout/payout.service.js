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
var PayoutService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.PayoutService = void 0;
const common_1 = require("@nestjs/common");
const database_service_1 = require("../database/database.service");
const microservices_1 = require("@nestjs/microservices");
let PayoutService = PayoutService_1 = class PayoutService {
    prisma;
    kafkaClient;
    logger = new common_1.Logger(PayoutService_1.name);
    constructor(prisma, kafkaClient) {
        this.prisma = prisma;
        this.kafkaClient = kafkaClient;
    }
    async requestPayout(dto) {
        this.logger.log(`Initiating Payout Request for Creator: ${dto.creatorId}`);
        const creator = await this.prisma.creatorProfile.findUniqueOrThrow({
            where: { id: dto.creatorId },
            select: { kycStatus: true, taxProfileId: true }
        });
        if (creator.kycStatus !== 'verified') {
            throw new common_1.BadRequestException('PAYOUT_FAILED: KYC Status not verified.');
        }
        if (!creator.taxProfileId) {
            throw new common_1.BadRequestException('PAYOUT_FAILED: Tax Profile missing.');
        }
        const payout = await this.prisma.payout.create({
            data: {
                creatorId: dto.creatorId,
                amount: dto.amount,
                currency: 'USD',
                status: 'pending',
            }
        });
        this.logger.log(`Payout Record Stored: ${payout.id}. Emitting PayoutRequested to Ledger.`);
        this.kafkaClient.emit('PayoutRequested', {
            payoutId: payout.id,
            creatorId: payout.creatorId,
            amount: payout.amount,
            timestamp: new Date().toISOString()
        });
        return payout;
    }
    async handlePayoutConfirmation(event) {
        this.logger.log(`Payout Confirmation Received from Ledger: ${event.payoutId}`);
        await this.prisma.payout.update({
            where: { id: event.payoutId },
            data: {
                status: event.status,
                processedAt: new Date()
            }
        });
    }
    async getPayoutHistory(userId) {
        const profile = await this.prisma.creatorProfile.findUnique({
            where: { userId }
        });
        if (!profile)
            return [];
        return await this.prisma.payout.findMany({
            where: { creatorId: profile.id },
            orderBy: { createdAt: 'desc' }
        });
    }
};
exports.PayoutService = PayoutService;
exports.PayoutService = PayoutService = PayoutService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(1, (0, common_1.Inject)('KAFKA_SERVICE')),
    __metadata("design:paramtypes", [database_service_1.DatabaseService,
        microservices_1.ClientKafka])
], PayoutService);
//# sourceMappingURL=payout.service.js.map