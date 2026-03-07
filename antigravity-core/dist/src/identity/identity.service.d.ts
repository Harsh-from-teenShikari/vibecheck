import { DatabaseService } from '../database/database.service';
import { CreateUserDto, CreateCreatorProfileDto } from './dto/create-identity.dto';
import { LedgerService } from '../ledger/ledger.service';
export declare class IdentityService {
    private prisma;
    private ledgerService;
    private readonly logger;
    constructor(prisma: DatabaseService, ledgerService: LedgerService);
    createUser(dto: CreateUserDto): Promise<{
        id: string;
        email: string;
        passwordHash: string | null;
        role: import("@prisma/client").$Enums.UserRole;
        createdAt: Date;
        updatedAt: Date;
    }>;
    getUserByEmail(email: string): Promise<{
        id: string;
        email: string;
        passwordHash: string | null;
        role: import("@prisma/client").$Enums.UserRole;
        createdAt: Date;
        updatedAt: Date;
    } | null>;
    createCreatorProfile(dto: CreateCreatorProfileDto): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        niche: string;
        region: string;
        followers: number;
        trustScore: number;
        kycStatus: import("@prisma/client").$Enums.KycStatus;
        taxProfileId: string | null;
        userId: string;
    }>;
    getCreatorTrustScore(creatorId: string): Promise<number>;
    getAllUsers(): Promise<({
        user: {
            email: string;
            role: import("@prisma/client").$Enums.UserRole;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        niche: string;
        region: string;
        followers: number;
        trustScore: number;
        kycStatus: import("@prisma/client").$Enums.KycStatus;
        taxProfileId: string | null;
        userId: string;
    })[]>;
    getCreatorDashboardMetrics(creatorId: string): Promise<{
        availableBalance: number;
        pendingApprovals: number;
        trustScore: number;
        conversionRate: number;
        recentActivity: {
            id: string;
            type: string;
            details: string;
            amount: string;
            time: string;
        }[];
        activeCampaigns: {
            id: string;
            name: string;
            type: import("@prisma/client").$Enums.CampaignType;
            rewardPool: number | null;
        }[];
    }>;
}
