"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const dotenv = __importStar(require("dotenv"));
dotenv.config();
const prisma = new client_1.PrismaClient();
async function main() {
    console.log('Seeding the Antigravity database with mock data...');
    const user = await prisma.user.upsert({
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
    const user2 = await prisma.user.upsert({
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
    const creatorProfile1 = await prisma.creatorProfile.findUnique({ where: { userId: user.id } });
    const creatorProfile2 = await prisma.creatorProfile.findUnique({ where: { userId: user2.id } });
    const campaign1 = await prisma.campaign.create({
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
    const campaign2 = await prisma.campaign.create({
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
    await prisma.submission.create({
        data: {
            campaignId: campaign1.id,
            creatorId: creatorProfile2.id,
            status: 'under_review',
            aiConfidence: 0.45,
            fraudScore: 0.85,
            contentData: { url: 'https://tiktok.com/@daily_hustle/video/12345' },
        }
    });
    await prisma.submission.create({
        data: {
            campaignId: campaign2.id,
            creatorId: creatorProfile1.id,
            status: 'approved',
            aiConfidence: 0.98,
            fraudScore: 0.05,
            contentData: { url: 'https://youtube.com/shorts/abcdef' },
        }
    });
    await prisma.payout.create({
        data: {
            creatorId: creatorProfile1.id,
            amount: 1250,
            currency: 'USD',
            status: 'completed',
            processedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
        }
    });
    await prisma.payout.create({
        data: {
            creatorId: creatorProfile1.id,
            amount: 340,
            currency: 'USD',
            status: 'pending',
        }
    });
    console.log('Database seeded successfully!');
}
main()
    .catch((e) => {
    console.error(e);
    process.exit(1);
})
    .finally(async () => {
    await prisma.$disconnect();
});
//# sourceMappingURL=seed.js.map