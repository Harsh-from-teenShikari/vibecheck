import { DatabaseService } from '../database/database.service';
import { CreateUserDto, CreateCreatorProfileDto } from './dto/create-identity.dto';
export declare class IdentityService {
    private prisma;
    private readonly logger;
    constructor(prisma: DatabaseService);
    createUser(dto: CreateUserDto): Promise<{
        email: string;
        role: import("@prisma/client").$Enums.UserRole;
        id: string;
        passwordHash: string | null;
        createdAt: Date;
        updatedAt: Date;
    }>;
    createCreatorProfile(dto: CreateCreatorProfileDto): Promise<{
        userId: string;
        niche: string;
        region: string;
        followers: number;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        trustScore: number;
        kycStatus: import("@prisma/client").$Enums.KycStatus;
        taxProfileId: string | null;
    }>;
    getCreatorTrustScore(creatorId: string): Promise<number>;
}
