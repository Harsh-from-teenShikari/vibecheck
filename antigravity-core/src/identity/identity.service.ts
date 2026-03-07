import { Injectable, Logger } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { CreateUserDto, CreateCreatorProfileDto } from './dto/create-identity.dto';
import { LedgerService } from '../ledger/ledger.service';

@Injectable()
export class IdentityService {
    private readonly logger = new Logger(IdentityService.name);

    constructor(
        private prisma: DatabaseService,
        private ledgerService: LedgerService
    ) { }

    async createUser(dto: CreateUserDto) {
        this.logger.log(`Creating generalized User: ${dto.email}`);

        return await this.prisma.user.create({
            data: {
                email: dto.email,
                role: dto.role,
            },
        });
    }

    async getUserByEmail(email: string) {
        return await this.prisma.user.findUnique({
            where: { email }
        });
    }

    async createCreatorProfile(dto: CreateCreatorProfileDto) {
        this.logger.log(`Provisioning Creator Profile for User: ${dto.userId}`);

        return await this.prisma.creatorProfile.create({
            data: {
                userId: dto.userId,
                niche: dto.niche,
                region: dto.region,
                followers: dto.followers,
                trustScore: 0.5, // System Default (Doctrine 4)
            },
        });
    }

    async getCreatorTrustScore(creatorId: string) {
        const profile = await this.prisma.creatorProfile.findUniqueOrThrow({
            where: { id: creatorId },
            select: { trustScore: true },
        });
        return profile.trustScore;
    }

    async getAllUsers() {
        return await this.prisma.creatorProfile.findMany({
            include: {
                user: { select: { email: true, role: true } },
            },
            orderBy: { createdAt: 'desc' }
        });
    }

    /**
     * Dashboard Analytics Aggregator for individual creators
     */
    async getCreatorDashboardMetrics(creatorId: string) {
        this.logger.log(`Aggregating Dashboard Metrics for Creator: ${creatorId}`);

        // 1. Available Balance
        const balance = await this.ledgerService.getAccountBalance(`payable:creator:${creatorId}`);

        // 2. Trust Score
        const profile = await this.prisma.creatorProfile.findUnique({
            where: { id: creatorId },
            select: { trustScore: true }
        });

        // 3. Pending Approvals
        const pendingCount = await this.prisma.submission.count({
            where: {
                creatorId,
                status: {
                    in: ['pending', 'under_review']
                }
            }
        });

        // 4. Conversion Rate
        const totalSubmissions = await this.prisma.submission.count({ where: { creatorId } });
        const approvedSubmissions = await this.prisma.submission.count({
            where: { creatorId, status: 'approved' }
        });
        const conversionRate = totalSubmissions > 0 ? (approvedSubmissions / totalSubmissions) * 100 : 0;

        // 5. Recent Activity (Latest Submissions)
        // Note: For simplicity, combining payouts and submissions is ideal. Here we use submissions as proxy for activity.
        const recentSubmissions = await this.prisma.submission.findMany({
            where: { creatorId },
            orderBy: { createdAt: 'desc' },
            take: 4,
            include: { campaign: { select: { name: true } } }
        });

        const activity = recentSubmissions.map(sub => ({
            id: sub.id,
            type: 'Submission ' + (sub.status.charAt(0).toUpperCase() + sub.status.slice(1)),
            details: `Campaign: ${sub.campaign.name}`,
            amount: sub.status === 'approved' ? `+$${(sub.fraudScore < 0.3 ? 20 : 0)}` : '-', // Mocking earnings logic slightly for UI
            time: sub.createdAt.toISOString()
        }));

        // 6. Active Campaigns (Joined)
        const joinedCampaigns = await this.prisma.campaignParticipant.findMany({
            where: { creatorId },
            include: {
                campaign: {
                    select: {
                        id: true,
                        name: true,
                        type: true,
                        rewardPool: true,
                    }
                }
            },
            take: 3
        });

        return {
            availableBalance: balance,
            pendingApprovals: pendingCount,
            trustScore: Number((profile?.trustScore || 0).toFixed(2)),
            conversionRate: Number(conversionRate.toFixed(1)),
            recentActivity: activity,
            activeCampaigns: joinedCampaigns.map(jc => ({
                id: jc.campaign.id,
                name: jc.campaign.name,
                type: jc.campaign.type,
                rewardPool: jc.campaign.rewardPool
            }))
        };
    }
}
