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
var SubmissionService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.SubmissionService = void 0;
const common_1 = require("@nestjs/common");
const database_service_1 = require("../database/database.service");
const ai_verification_service_1 = require("../ai-verification/ai-verification.service");
const commission_service_1 = require("../commission/commission.service");
let SubmissionService = SubmissionService_1 = class SubmissionService {
    prisma;
    aiVerificationService;
    commissionService;
    logger = new common_1.Logger(SubmissionService_1.name);
    constructor(prisma, aiVerificationService, commissionService) {
        this.prisma = prisma;
        this.aiVerificationService = aiVerificationService;
        this.commissionService = commissionService;
    }
    async createSubmission(dto) {
        this.logger.log(`Ingesting Submission for Campaign: ${dto.campaignId} by Creator: ${dto.creatorId}`);
        const campaign = await this.prisma.campaign.findUnique({
            where: { id: dto.campaignId }
        });
        if (!campaign) {
            throw new Error('Campaign not found');
        }
        if (campaign.rewardPool !== null && campaign.rewardPool <= 0) {
            throw new Error('This campaign has exhausted its reward pool. No further submissions are accepted.');
        }
        const submission = await this.prisma.submission.create({
            data: {
                campaignId: dto.campaignId,
                creatorId: dto.creatorId,
                contentData: { url: dto.contentUrl },
            },
        });
        this.logger.log(`Submission ${submission.id} persisted. Running AI Verification.`);
        const eventPayload = {
            submissionId: submission.id,
            campaignId: submission.campaignId,
            creatorId: submission.creatorId,
            contentData: submission.contentData,
            timestamp: new Date().toISOString()
        };
        this.aiVerificationService.evaluateSubmission(eventPayload).catch(e => {
            this.logger.error(`AI Verification failed for ${submission.id}:`, e);
        });
        return submission;
    }
    async getCreatorSubmissions() {
        return await this.prisma.submission.findMany({
            orderBy: { createdAt: 'desc' }
        });
    }
    async getFlaggedSubmissions() {
        return await this.prisma.submission.findMany({
            where: {
                OR: [
                    { status: 'under_review' },
                    { fraudScore: { gt: 0.7 } }
                ]
            },
            include: {
                creator: { select: { user: { select: { email: true } }, region: true } },
                campaign: { select: { name: true } }
            },
            orderBy: { createdAt: 'desc' }
        });
    }
    async verifySubmission(id, status) {
        this.logger.log(`Manual Verification for Submission ${id}: ${status}`);
        const submission = await this.prisma.submission.update({
            where: { id },
            data: { status }
        });
        if (status === 'approved') {
            await this.commissionService.evaluateAndProcessCommission({ submissionId: id });
        }
        return submission;
    }
};
exports.SubmissionService = SubmissionService;
exports.SubmissionService = SubmissionService = SubmissionService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [database_service_1.DatabaseService,
        ai_verification_service_1.AiVerificationService,
        commission_service_1.CommissionService])
], SubmissionService);
//# sourceMappingURL=submission.service.js.map