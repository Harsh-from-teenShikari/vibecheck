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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var FraudService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.FraudService = void 0;
const common_1 = require("@nestjs/common");
const database_service_1 = require("../database/database.service");
const notification_service_1 = require("../notification/notification.service");
const ioredis_1 = __importDefault(require("ioredis"));
let FraudService = FraudService_1 = class FraudService {
    prisma;
    notificationService;
    logger = new common_1.Logger(FraudService_1.name);
    redisClient;
    constructor(prisma, notificationService) {
        this.prisma = prisma;
        this.notificationService = notificationService;
        this.redisClient = new ioredis_1.default(process.env.REDIS_PORT ? parseInt(process.env.REDIS_PORT) : 6379, process.env.REDIS_HOST || 'localhost');
    }
    async calculateFraudScore(event) {
        this.logger.log(`Calculating Fraud Score for Submission: ${event.submissionId}`);
        let fraudScore = 0.0;
        const reasons = [];
        const velocityKey = `velocity:creator:${event.creatorId}`;
        const recentSubmissions = await this.redisClient.incr(velocityKey);
        if (recentSubmissions === 1) {
            await this.redisClient.expire(velocityKey, 3600);
        }
        if (recentSubmissions > 10) {
            fraudScore += 0.4;
            reasons.push('High submission velocity detected (>10/hr)');
        }
        const creator = await this.prisma.creatorProfile.findUnique({
            where: { id: event.creatorId },
            select: { trustScore: true },
        });
        if (creator && creator.trustScore < 0.3) {
            fraudScore += 0.3;
            reasons.push('Creator has historically low Trust Score');
        }
        await this.prisma.fraudScore.create({
            data: {
                creatorId: event.creatorId,
                submissionId: event.submissionId,
                score: fraudScore,
                reason: reasons.length ? reasons : ['Normal behavior'],
            },
        });
        await this.prisma.submission.update({
            where: { id: event.submissionId },
            data: { fraudScore },
        });
        this.logger.log(`Fraud Score for ${event.submissionId} is ${fraudScore}`);
        if (fraudScore > 0.8) {
            await this.notificationService.notifyOperatorAlert('High Fraud Score Detected', `Creator ${event.creatorId} scored ${fraudScore} on Submission ${event.submissionId}.`);
        }
        return fraudScore;
    }
};
exports.FraudService = FraudService;
exports.FraudService = FraudService = FraudService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [database_service_1.DatabaseService,
        notification_service_1.NotificationService])
], FraudService);
//# sourceMappingURL=fraud.service.js.map