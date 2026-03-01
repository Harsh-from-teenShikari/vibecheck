import { DatabaseService } from '../database/database.service';
import { CreateUserDto, CreateCreatorProfileDto } from './dto/create-identity.dto';
export declare class IdentityService {
    private prisma;
    private readonly logger;
    constructor(prisma: DatabaseService);
    createUser(dto: CreateUserDto): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        email: string;
        passwordHash: string | null;
        role: import("@prisma/client").$Enums.UserRole;
    }>;
    createCreatorProfile(dto: CreateCreatorProfileDto): Promise<{
        id: string;
        userId: string;
        niche: string;
        region: string;
        followers: number;
        trustScore: number;
        kycStatus: import("@prisma/client").$Enums.KycStatus;
        taxProfileId: string | null;
        createdAt: Date;
        updatedAt: Date;
    }>;
    getCreatorTrustScore(creatorId: string): Promise<number>;
    getAllUsers(): Promise<({
        user: {
            email: string;
            role: import("@prisma/client").$Enums.UserRole;
        };
    } & {
        id: string;
        userId: string;
        niche: string;
        region: string;
        followers: number;
        trustScore: number;
        kycStatus: import("@prisma/client").$Enums.KycStatus;
        taxProfileId: string | null;
        createdAt: Date;
        updatedAt: Date;
    })[]>;
}
