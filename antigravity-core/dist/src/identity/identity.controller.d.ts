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
            email: any;
            role: string;
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
        region: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        niche: string;
        followers: number;
        trustScore: number;
        kycStatus: import("@prisma/client").$Enums.KycStatus;
        taxProfileId: string | null;
    })[]>;
}
