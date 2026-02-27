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
var PayoutController_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.PayoutController = void 0;
const common_1 = require("@nestjs/common");
const microservices_1 = require("@nestjs/microservices");
const payout_service_1 = require("./payout.service");
const payout_dto_1 = require("./dto/payout.dto");
let PayoutController = PayoutController_1 = class PayoutController {
    payoutService;
    logger = new common_1.Logger(PayoutController_1.name);
    constructor(payoutService) {
        this.payoutService = payoutService;
    }
    async initiatePayout(body) {
        return await this.payoutService.requestPayout(body);
    }
    async handlePayoutProcessed(message) {
        this.logger.log(`Ledger event caught [PayoutProcessed] for: ${message.payoutId}`);
        await this.payoutService.handlePayoutConfirmation(message);
    }
    async getPayoutHistory(creatorId) {
        return await this.payoutService.getPayoutHistory(creatorId);
    }
};
exports.PayoutController = PayoutController;
__decorate([
    (0, common_1.Post)('request'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [payout_dto_1.CreatePayoutDto]),
    __metadata("design:returntype", Promise)
], PayoutController.prototype, "initiatePayout", null);
__decorate([
    (0, microservices_1.EventPattern)('PayoutProcessed'),
    __param(0, (0, microservices_1.Payload)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], PayoutController.prototype, "handlePayoutProcessed", null);
__decorate([
    (0, common_1.Get)('history/:creatorId'),
    __param(0, (0, common_1.Param)('creatorId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], PayoutController.prototype, "getPayoutHistory", null);
exports.PayoutController = PayoutController = PayoutController_1 = __decorate([
    (0, common_1.Controller)('payouts'),
    __metadata("design:paramtypes", [payout_service_1.PayoutService])
], PayoutController);
//# sourceMappingURL=payout.controller.js.map