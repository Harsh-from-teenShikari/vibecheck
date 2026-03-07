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
var CommissionService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommissionService = void 0;
const common_1 = require("@nestjs/common");
const database_service_1 = require("../database/database.service");
const ledger_service_1 = require("../ledger/ledger.service");
let CommissionService = CommissionService_1 = class CommissionService {
    prisma;
    ledgerService;
    logger = new common_1.Logger(CommissionService_1.name);
    constructor(prisma, ledgerService) {
        this.prisma = prisma;
        this.ledgerService = ledgerService;
    }
    async evaluateAndProcessCommission(dto) {
        this.logger.log(`Evaluating Commission viability for Submission: ${dto.submissionId}`);
        const submission = await this.prisma.submission.findUnique({
            where: { id: dto.submissionId },
            include: { campaign: true, creator: true, fraudScores: true },
        });
        if (!submission) {
            this.logger.warn(`Submission ${dto.submissionId} not found. Likely deleted during DB reset. Safely ignoring Kafka message.`);
            return;
        }
        if (submission.status !== 'approved') {
            this.logger.log(`Submission ${submission.id} is not approved by Operator.`);
            return;
        }
        if (submission.fraudScores.length > 0) {
            const latestFraudScore = submission.fraudScores[submission.fraudScores.length - 1].score;
            if (latestFraudScore > 0.5) {
                this.logger.warn(`Submission ${submission.id} has high Fraud Score: ${latestFraudScore}, but Operator MANUALLY APPROVED payload.`);
            }
        }
        else {
            this.logger.log(`Submission ${submission.id} bypassing Fraud Engine strict check (Manual Validation Assumed).`);
        }
        const finalAmount = submission.campaign.targetReward ? submission.campaign.targetReward : 1000;
        const [commission] = await this.prisma.$transaction([
            this.prisma.commission.create({
                data: {
                    submissionId: submission.id,
                    campaignId: submission.campaignId,
                    creatorId: submission.creatorId,
                    amount: finalAmount,
                    currency: 'USD',
                }
            }),
            this.prisma.campaign.update({
                where: { id: submission.campaignId },
                data: {
                    rewardPool: { decrement: finalAmount }
                }
            })
        ]);
        this.logger.log(`Commission Processed: ${commission.id} | Amount: ${finalAmount} USD cents`);
        await this.ledgerService.recordCommission({
            commissionId: commission.id,
            creatorId: commission.creatorId,
            campaignId: commission.campaignId,
            amount: commission.amount,
        });
    }
};
exports.CommissionService = CommissionService;
exports.CommissionService = CommissionService = CommissionService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [database_service_1.DatabaseService,
        ledger_service_1.LedgerService])
], CommissionService);
//# sourceMappingURL=commission.service.js.map