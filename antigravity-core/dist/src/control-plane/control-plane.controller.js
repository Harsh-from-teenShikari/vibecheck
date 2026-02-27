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
var ControlPlaneController_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ControlPlaneController = void 0;
const common_1 = require("@nestjs/common");
const control_plane_service_1 = require("./control-plane.service");
let ControlPlaneController = ControlPlaneController_1 = class ControlPlaneController {
    controlPlaneService;
    logger = new common_1.Logger(ControlPlaneController_1.name);
    constructor(controlPlaneService) {
        this.controlPlaneService = controlPlaneService;
    }
    async getDriftMetrics() {
        return await this.controlPlaneService.getSystemDriftMetrics();
    }
    async getAuditLogs() {
        return await this.controlPlaneService.getRecentAuditLogs();
    }
    async triggerManualOverride(body) {
        this.logger.warn(`Rest Endpoint Triggered: Manual Override by ${body.operatorId}`);
        return await this.controlPlaneService.logOperatorOverride(body.operatorId, body.entityId, body.action, body.justification);
    }
};
exports.ControlPlaneController = ControlPlaneController;
__decorate([
    (0, common_1.Get)('metrics/drift'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], ControlPlaneController.prototype, "getDriftMetrics", null);
__decorate([
    (0, common_1.Get)('audit/logs'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], ControlPlaneController.prototype, "getAuditLogs", null);
__decorate([
    (0, common_1.Post)('override'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ControlPlaneController.prototype, "triggerManualOverride", null);
exports.ControlPlaneController = ControlPlaneController = ControlPlaneController_1 = __decorate([
    (0, common_1.Controller)('control-plane'),
    __metadata("design:paramtypes", [control_plane_service_1.ControlPlaneService])
], ControlPlaneController);
//# sourceMappingURL=control-plane.controller.js.map