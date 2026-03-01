import { PrismaClient } from '@prisma/client';
import * as dotenv from 'dotenv';

dotenv.config();
const prisma = new PrismaClient();

async function main() {
    console.log('Seeding the Antigravity database with mock data...');

    // 1. Create a mock user + creator profile
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

    // 2. Create another mock user
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

    // 3. Create active campaigns
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

    // 4. Create Submissions
    // Flagged submission
    await prisma.submission.create({
        data: {
            campaignId: campaign1.id,
            creatorId: creatorProfile2!.id,
            status: 'under_review',
            aiConfidence: 0.45,
            fraudScore: 0.85,
            contentData: { url: 'https://tiktok.com/@daily_hustle/video/12345' },
        }
    });

    // Approved submission
    await prisma.submission.create({
        data: {
            campaignId: campaign2.id,
            creatorId: creatorProfile1!.id,
            status: 'approved',
            aiConfidence: 0.98,
            fraudScore: 0.05,
            contentData: { url: 'https://youtube.com/shorts/abcdef' },
        }
    });

    // 5. Create Payout History for creator 1
    await prisma.payout.create({
        data: {
            creatorId: creatorProfile1!.id,
            amount: 1250,
            currency: 'USD',
            status: 'completed',
            processedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 7 days ago
        }
    });

    await prisma.payout.create({
        data: {
            creatorId: creatorProfile1!.id,
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
