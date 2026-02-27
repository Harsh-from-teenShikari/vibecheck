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
var IdentityService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.IdentityService = void 0;
const common_1 = require("@nestjs/common");
const database_service_1 = require("../database/database.service");
let IdentityService = IdentityService_1 = class IdentityService {
    prisma;
    logger = new common_1.Logger(IdentityService_1.name);
    constructor(prisma) {
        this.prisma = prisma;
    }
    async createUser(dto) {
        this.logger.log(`Creating generalized User: ${dto.email}`);
        return await this.prisma.user.create({
            data: {
                email: dto.email,
                role: dto.role,
            },
        });
    }
    async createCreatorProfile(dto) {
        this.logger.log(`Provisioning Creator Profile for User: ${dto.userId}`);
        return await this.prisma.creatorProfile.create({
            data: {
                userId: dto.userId,
                niche: dto.niche,
                region: dto.region,
                followers: dto.followers,
                trustScore: 0.5,
            },
        });
    }
    async getCreatorTrustScore(creatorId) {
        const profile = await this.prisma.creatorProfile.findUniqueOrThrow({
            where: { id: creatorId },
            select: { trustScore: true },
        });
        return profile.trustScore;
    }
};
exports.IdentityService = IdentityService;
exports.IdentityService = IdentityService = IdentityService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [database_service_1.DatabaseService])
], IdentityService);
//# sourceMappingURL=identity.service.js.map