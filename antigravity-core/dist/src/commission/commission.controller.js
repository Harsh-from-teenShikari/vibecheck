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
var CommissionController_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommissionController = void 0;
const common_1 = require("@nestjs/common");
const microservices_1 = require("@nestjs/microservices");
const commission_service_1 = require("./commission.service");
let CommissionController = CommissionController_1 = class CommissionController {
    commissionService;
    logger = new common_1.Logger(CommissionController_1.name);
    constructor(commissionService) {
        this.commissionService = commissionService;
    }
    async handleVerificationCompleted(message) {
        this.logger.log(`Received [VerificationCompleted] Trigger for Submission: ${message.submissionId}`);
        await this.commissionService.evaluateAndProcessCommission({ submissionId: message.submissionId });
    }
    async handleFraudCalculated(message) {
        this.logger.log(`Received [FraudScoreCalculated] Trigger for Submission: ${message.submissionId}`);
        await this.commissionService.evaluateAndProcessCommission({ submissionId: message.submissionId });
    }
};
exports.CommissionController = CommissionController;
__decorate([
    (0, microservices_1.EventPattern)('VerificationCompleted'),
    __param(0, (0, microservices_1.Payload)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], CommissionController.prototype, "handleVerificationCompleted", null);
__decorate([
    (0, microservices_1.EventPattern)('FraudScoreCalculated'),
    __param(0, (0, microservices_1.Payload)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], CommissionController.prototype, "handleFraudCalculated", null);
exports.CommissionController = CommissionController = CommissionController_1 = __decorate([
    (0, common_1.Controller)(),
    __metadata("design:paramtypes", [commission_service_1.CommissionService])
], CommissionController);
//# sourceMappingURL=commission.controller.js.map