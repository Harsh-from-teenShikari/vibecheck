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
var NotificationController_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationController = void 0;
const common_1 = require("@nestjs/common");
const microservices_1 = require("@nestjs/microservices");
const notification_service_1 = require("./notification.service");
let NotificationController = NotificationController_1 = class NotificationController {
    notificationService;
    logger = new common_1.Logger(NotificationController_1.name);
    constructor(notificationService) {
        this.notificationService = notificationService;
    }
    async handlePayoutProcessed(message) {
        this.logger.log(`Received [PayoutProcessed] for Notification Dispatch`);
        await this.notificationService.notifyCreator(message.creatorId, 'Your Payout is Complete', `We have successfully processed a payout of ${message.amount} USD cents.`);
    }
    async handleFraudAlerts(message) {
        if (message.fraudScore > 0.8) {
            await this.notificationService.notifyOperatorAlert('High Fraud Score Detected', `Creator ${message.creatorId} scored ${message.fraudScore} on Submission ${message.submissionId}.`);
        }
    }
};
exports.NotificationController = NotificationController;
__decorate([
    (0, microservices_1.EventPattern)('PayoutProcessed'),
    __param(0, (0, microservices_1.Payload)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], NotificationController.prototype, "handlePayoutProcessed", null);
__decorate([
    (0, microservices_1.EventPattern)('FraudScoreCalculated'),
    __param(0, (0, microservices_1.Payload)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], NotificationController.prototype, "handleFraudAlerts", null);
exports.NotificationController = NotificationController = NotificationController_1 = __decorate([
    (0, common_1.Controller)(),
    __metadata("design:paramtypes", [notification_service_1.NotificationService])
], NotificationController);
//# sourceMappingURL=notification.controller.js.map