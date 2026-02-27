import { DatabaseService } from '../database/database.service';
import { CreateUserDto, CreateCreatorProfileDto } from './dto/create-identity.dto';
export declare class IdentityService {
    private prisma;
    private readonly logger;
    constructor(prisma: DatabaseService);
    createUser(dto: CreateUserDto): Promise<{
        id: string;
        email: string;
        passwordHash: string | null;
        role: import("@prisma/client").$Enums.UserRole;
        createdAt: Date;
        updatedAt: Date;
    }>;
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
}
