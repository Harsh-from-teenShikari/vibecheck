"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const app_controller_1 = require("./app.controller");
const app_service_1 = require("./app.service");
const database_module_1 = require("./database/database.module");
const identity_module_1 = require("./identity/identity.module");
const campaign_module_1 = require("./campaign/campaign.module");
const submission_module_1 = require("./submission/submission.module");
const ledger_module_1 = require("./ledger/ledger.module");
const ai_verification_module_1 = require("./ai-verification/ai-verification.module");
const fraud_module_1 = require("./fraud/fraud.module");
const commission_module_1 = require("./commission/commission.module");
const payout_module_1 = require("./payout/payout.module");
const notification_module_1 = require("./notification/notification.module");
const control_plane_module_1 = require("./control-plane/control-plane.module");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [database_module_1.DatabaseModule, identity_module_1.IdentityModule, campaign_module_1.CampaignModule, submission_module_1.SubmissionModule, ledger_module_1.LedgerModule, ai_verification_module_1.AiVerificationModule, fraud_module_1.FraudModule, commission_module_1.CommissionModule, payout_module_1.PayoutModule, notification_module_1.NotificationModule, control_plane_module_1.ControlPlaneModule],
        controllers: [app_controller_1.AppController],
        providers: [app_service_1.AppService],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map