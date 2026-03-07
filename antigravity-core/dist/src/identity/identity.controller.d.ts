import { IdentityService } from './identity.service';
import { CreateUserDto } from './dto/create-identity.dto';
export declare class IdentityController {
    private readonly identityService;
    private readonly logger;
    constructor(identityService: IdentityService);
    register(createUserDto: CreateUserDto): Promise<{
        message: string;
        user: {
            id: string;
            email: string;
            role: import("@prisma/client").$Enums.UserRole;
        };
        accessToken: string;
    }>;
    login(body: any): Promise<{
        message: string;
        user: {
            id: string;
            email: string;
            role: import("@prisma/client").$Enums.UserRole;
        };
        accessToken: string;
    }>;
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
