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
var CommissionService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommissionService = void 0;
const common_1 = require("@nestjs/common");
const database_service_1 = require("../database/database.service");
const microservices_1 = require("@nestjs/microservices");
let CommissionService = CommissionService_1 = class CommissionService {
    prisma;
    kafkaClient;
    logger = new common_1.Logger(CommissionService_1.name);
    constructor(prisma, kafkaClient) {
        this.prisma = prisma;
        this.kafkaClient = kafkaClient;
    }
    async evaluateAndProcessCommission(dto) {
        this.logger.log(`Evaluating Commission viability for Submission: ${dto.submissionId}`);
        const submission = await this.prisma.submission.findUniqueOrThrow({
            where: { id: dto.submissionId },
            include: { campaign: true, creator: true, fraudScores: true },
        });
        if (submission.status !== 'approved') {
            this.logger.log(`Submission ${submission.id} is not approved by AI.`);
            return;
        }
        if (submission.fraudScores.length === 0) {
            this.logger.log(`Submission ${submission.id} is pending Fraud completion.`);
            return;
        }
        const latestFraudScore = submission.fraudScores[submission.fraudScores.length - 1].score;
        if (latestFraudScore > 0.5) {
            this.logger.warn(`Submission ${submission.id} rejected by Commission Engine due to high Fraud Score: ${latestFraudScore}`);
            return;
        }
        const baseReward = submission.campaign.rewardPool ? (submission.campaign.rewardPool / 1000) : 1000;
        const trustMultiplier = submission.creator.trustScore > 0.8 ? 1.5 : 1.0;
        const finalAmount = Math.floor(baseReward * trustMultiplier);
        const commission = await this.prisma.commission.create({
            data: {
                submissionId: submission.id,
                campaignId: submission.campaignId,
                creatorId: submission.creatorId,
                amount: finalAmount,
                currency: 'USD',
            }
        });
        this.logger.log(`Commission Processed: ${commission.id} | Amount: ${finalAmount} USD cents`);
        this.kafkaClient.emit('CommissionApproved', {
            commissionId: commission.id,
            creatorId: commission.creatorId,
            campaignId: commission.campaignId,
            amount: commission.amount,
            currency: commission.currency,
            timestamp: new Date().toISOString()
        });
    }
};
exports.CommissionService = CommissionService;
exports.CommissionService = CommissionService = CommissionService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(1, (0, common_1.Inject)('KAFKA_SERVICE')),
    __metadata("design:paramtypes", [database_service_1.DatabaseService,
        microservices_1.ClientKafka])
], CommissionService);
//# sourceMappingURL=commission.service.js.map