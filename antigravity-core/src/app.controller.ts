import { Controller, Get, Logger } from '@nestjs/common';
import { AppService } from './app.service';
import { DatabaseService } from './database/database.service';

@Controller()
export class AppController {
  private readonly logger = new Logger(AppController.name);

  constructor(
    private readonly appService: AppService,
    private readonly prisma: DatabaseService
  ) { }

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('seed')
  async seedDb() {
    this.logger.log('Seeding the Antigravity database with mock data...');

    try {
      // 1. Create a mock user + creator profile
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

      // 2. Create another mock user
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

      // 3. Create active campaigns
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

      // 4. Create Submissions
      // Flagged submission
      await this.prisma.submission.create({
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
      await this.prisma.submission.create({
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
      await this.prisma.payout.create({
        data: {
          creatorId: creatorProfile1!.id,
          amount: 1250,
          currency: 'USD',
          status: 'completed',
          processedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 7 days ago
        }
      });

      await this.prisma.payout.create({
        data: {
          creatorId: creatorProfile1!.id,
          amount: 340,
          currency: 'USD',
          status: 'pending',
        }
      });

      this.logger.log('Database seeded successfully!');
      return { success: true, message: 'Seeded successfully' };
    } catch (err: any) {
      this.logger.error('Seed failed', err);
      return { success: false, error: err.message };
    }
  }
}

