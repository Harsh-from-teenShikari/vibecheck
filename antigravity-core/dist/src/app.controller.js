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
var AppController_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppController = void 0;
const common_1 = require("@nestjs/common");
const app_service_1 = require("./app.service");
const database_service_1 = require("./database/database.service");
let AppController = AppController_1 = class AppController {
    appService;
    prisma;
    logger = new common_1.Logger(AppController_1.name);
    constructor(appService, prisma) {
        this.appService = appService;
        this.prisma = prisma;
    }
    getHello() {
        return this.appService.getHello();
    }
    async seedDb() {
        this.logger.log('Seeding the Antigravity database with mock data...');
        try {
            const user = await this.prisma.user.upsert({
                where: { email: 'mock_creator@antigravity.dev' },
                update: {},
                create: {
                    id: 'mock-user-id',
                    email: 'mock_creator@antigravity.dev',
                    role: 'creator',
                    creatorProfile: {
                        create: {
                            niche: 'Tech Reviews',
                            region: 'US',
                            followers: 125000,
                            trustScore: 0.95,
                            kycStatus: 'verified',
                            taxProfileId: 'TAX-999-000',
                        }
                    }
                },
            });
            const user2 = await this.prisma.user.upsert({
                where: { email: 'daily_hustle@antigravity.dev' },
                update: {},
                create: {
                    email: 'daily_hustle@antigravity.dev',
                    role: 'creator',
                    creatorProfile: {
                        create: {
                            niche: 'Crypto & Web3',
                            region: 'UK',
                            followers: 45000,
                            trustScore: 0.45,
                            kycStatus: 'pending',
                        }
                    }
                },
            });
            const creatorProfile1 = await this.prisma.creatorProfile.findUnique({ where: { userId: user.id } });
            const creatorProfile2 = await this.prisma.creatorProfile.findUnique({ where: { userId: user2.id } });
            const campaign1 = await this.prisma.campaign.create({
                data: {
                    name: 'Summer SaaS Launch',
                    type: 'CLIPPING',
                    region: 'Global',
                    minFollowers: 10000,
                    targetNiche: 'Tech',
                    rewardPool: 5000,
                    status: 'active',
                    requiredHashtags: ['#saas', '#tech'],
                }
            });
            const campaign2 = await this.prisma.campaign.create({
                data: {
                    name: 'Trading Strategy E-Book',
                    type: 'AFFILIATE',
                    region: 'US',
                    minFollowers: 50000,
                    targetNiche: 'Finance',
                    rewardPool: 15000,
                    status: 'active',
                    requiredHashtags: ['#trading', '#finance'],
                }
            });
            await this.prisma.submission.create({
                data: {
                    campaignId: campaign1.id,
                    creatorId: creatorProfile2.id,
                    status: 'under_review',
                    aiConfidence: 0.45,
                    fraudScore: 0.85,
                    contentData: { url: 'https://tiktok.com/@daily_hustle/video/12345' },
                }
            });
            await this.prisma.submission.create({
                data: {
                    campaignId: campaign2.id,
                    creatorId: creatorProfile1.id,
                    status: 'approved',
                    aiConfidence: 0.98,
                    fraudScore: 0.05,
                    contentData: { url: 'https://youtube.com/shorts/abcdef' },
                }
            });
            await this.prisma.payout.create({
                data: {
                    creatorId: creatorProfile1.id,
                    amount: 1250,
                    currency: 'USD',
                    status: 'completed',
                    processedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
                }
            });
            await this.prisma.payout.create({
                data: {
                    creatorId: creatorProfile1.id,
                    amount: 340,
                    currency: 'USD',
                    status: 'pending',
                }
            });
            this.logger.log('Database seeded successfully!');
            return { success: true, message: 'Seeded successfully' };
        }
        catch (err) {
            this.logger.error('Seed failed', err);
            return { success: false, error: err.message };
        }
    }
};
exports.AppController = AppController;
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", String)
], AppController.prototype, "getHello", null);
__decorate([
    (0, common_1.Get)('seed'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AppController.prototype, "seedDb", null);
exports.AppController = AppController = AppController_1 = __decorate([
    (0, common_1.Controller)(),
    __metadata("design:paramtypes", [app_service_1.AppService,
        database_service_1.DatabaseService])
], AppController);
//# sourceMappingURL=app.controller.js.map