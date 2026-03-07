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
var AiVerificationService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AiVerificationService = void 0;
const common_1 = require("@nestjs/common");
const database_service_1 = require("../database/database.service");
let AiVerificationService = AiVerificationService_1 = class AiVerificationService {
    prisma;
    logger = new common_1.Logger(AiVerificationService_1.name);
    constructor(prisma) {
        this.prisma = prisma;
    }
    async evaluateSubmission(submissionEvent) {
        this.logger.log(`Evaluating Submission: ${submissionEvent.submissionId}`);
        const submission = await this.prisma.submission.findUniqueOrThrow({
            where: { id: submissionEvent.submissionId },
            include: { campaign: true, creator: true },
        });
        const isEligible = this.checkEligibility(submission);
        if (!isEligible) {
            return this.rejectEarly(submission.id, 'Eligibility criteria not met');
        }
        let aiResult = await this.callMidTierModel(submission);
        if (aiResult.confidence < 0.85) {
            this.logger.warn(`Confidence threshold not met (${aiResult.confidence}). Escalating to Premium Model.`);
            aiResult = await this.callPremiumModel(submission, aiResult);
        }
        await this.prisma.aiVerificationReport.create({
            data: {
                submissionId: submission.id,
                modelUsed: aiResult.modelUsed,
                eligibility: aiResult.eligibility,
                compliance: aiResult.compliance,
                confidence: aiResult.confidence,
                riskFlags: aiResult.riskFlags,
                reasoning: aiResult.reasoning,
                rawOutput: { raw: "simulated_payload" },
            },
        });
        const state = 'under_review';
        await this.prisma.submission.update({
            where: { id: submission.id },
            data: {
                status: state,
                aiConfidence: aiResult.confidence,
                aiCompliance: aiResult.compliance,
                deterministicPassed: true,
            }
        });
        this.logger.log(`Submission ${submission.id} evaluated. Queued for manual verification.`);
    }
    checkEligibility(submission) {
        if (submission.creator.followers < submission.campaign.minFollowers)
            return false;
        if (submission.creator.region !== submission.campaign.region)
            return false;
        return true;
    }
    async callMidTierModel(context) {
        return {
            modelUsed: 'gemini-1.5-flash',
            eligibility: true,
            compliance: true,
            confidence: 0.82,
            riskFlags: [],
            reasoning: ['Content appears compliant but audio match is uncertain.'],
        };
    }
    async callPremiumModel(context, previousResult) {
        return {
            modelUsed: 'gpt-4o',
            eligibility: true,
            compliance: true,
            confidence: 0.98,
            riskFlags: [],
            reasoning: ['Audio matched dynamically via multimodal parsing. Fully compliant.'],
        };
    }
    async rejectEarly(submissionId, reason) {
        this.logger.log(`Evaluating Submission ${submissionId} Early: ${reason}. Queuing for manual rejection.`);
        await this.prisma.submission.update({
            where: { id: submissionId },
            data: { status: 'under_review', deterministicPassed: false }
        });
    }
};
exports.AiVerificationService = AiVerificationService;
exports.AiVerificationService = AiVerificationService = AiVerificationService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [database_service_1.DatabaseService])
], AiVerificationService);
//# sourceMappingURL=ai-verification.service.js.map