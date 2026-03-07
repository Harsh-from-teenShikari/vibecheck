"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PayoutModule = void 0;
const common_1 = require("@nestjs/common");
const database_module_1 = require("../database/database.module");
const ledger_module_1 = require("../ledger/ledger.module");
const notification_module_1 = require("../notification/notification.module");
const payout_service_1 = require("./payout.service");
const payout_controller_1 = require("./payout.controller");
let PayoutModule = class PayoutModule {
};
exports.PayoutModule = PayoutModule;
exports.PayoutModule = PayoutModule = __decorate([
    (0, common_1.Module)({
        imports: [database_module_1.DatabaseModule, ledger_module_1.LedgerModule, notification_module_1.NotificationModule],
        controllers: [payout_controller_1.PayoutController],
        providers: [payout_service_1.PayoutService],
        exports: [payout_service_1.PayoutService]
    })
], PayoutModule);
//# sourceMappingURL=payout.module.js.map