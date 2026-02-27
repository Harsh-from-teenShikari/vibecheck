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
var FraudController_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.FraudController = void 0;
const common_1 = require("@nestjs/common");
const microservices_1 = require("@nestjs/microservices");
const fraud_service_1 = require("./fraud.service");
let FraudController = FraudController_1 = class FraudController {
    fraudService;
    logger = new common_1.Logger(FraudController_1.name);
    constructor(fraudService) {
        this.fraudService = fraudService;
    }
    async handleSubmissionCreated(message) {
        this.logger.log(`Received Event [SubmissionCreated]: Evaluating Fraud velocity: ID ${message.submissionId}`);
        await this.fraudService.calculateFraudScore(message);
    }
};
exports.FraudController = FraudController;
__decorate([
    (0, microservices_1.EventPattern)('SubmissionCreated'),
    __param(0, (0, microservices_1.Payload)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], FraudController.prototype, "handleSubmissionCreated", null);
exports.FraudController = FraudController = FraudController_1 = __decorate([
    (0, common_1.Controller)(),
    __metadata("design:paramtypes", [fraud_service_1.FraudService])
], FraudController);
//# sourceMappingURL=fraud.controller.js.map