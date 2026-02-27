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
var LedgerController_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.LedgerController = void 0;
const common_1 = require("@nestjs/common");
const microservices_1 = require("@nestjs/microservices");
const ledger_service_1 = require("./ledger.service");
let LedgerController = LedgerController_1 = class LedgerController {
    ledgerService;
    logger = new common_1.Logger(LedgerController_1.name);
    constructor(ledgerService) {
        this.ledgerService = ledgerService;
    }
    async handleCommissionApproved(message) {
        this.logger.log(`Received [CommissionApproved] from Commission Engine for Commission: ${message.commissionId}`);
        await this.ledgerService.recordCommission({
            commissionId: message.commissionId,
            creatorId: message.creatorId,
            campaignId: message.campaignId,
            amount: message.amount,
        });
    }
    async handlePayoutRequested(message) {
        this.logger.log(`Received [PayoutRequested] from Payout Service for Payout: ${message.payoutId}`);
        await this.ledgerService.processPayout({
            payoutId: message.payoutId,
            creatorId: message.creatorId,
            amount: message.amount,
        });
    }
};
exports.LedgerController = LedgerController;
__decorate([
    (0, microservices_1.EventPattern)('CommissionApproved'),
    __param(0, (0, microservices_1.Payload)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], LedgerController.prototype, "handleCommissionApproved", null);
__decorate([
    (0, microservices_1.EventPattern)('PayoutRequested'),
    __param(0, (0, microservices_1.Payload)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], LedgerController.prototype, "handlePayoutRequested", null);
exports.LedgerController = LedgerController = LedgerController_1 = __decorate([
    (0, common_1.Controller)(),
    __metadata("design:paramtypes", [ledger_service_1.LedgerService])
], LedgerController);
//# sourceMappingURL=ledger.controller.js.map