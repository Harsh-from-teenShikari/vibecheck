import { Injectable, Logger } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { CreateUserDto, CreateCreatorProfileDto } from './dto/create-identity.dto';

@Injectable()
export class IdentityService {
    private readonly logger = new Logger(IdentityService.name);

    constructor(private prisma: DatabaseService) { }

    async createUser(dto: CreateUserDto) {
        this.logger.log(`Creating generalized User: ${dto.email}`);

        return await this.prisma.user.create({
            data: {
                email: dto.email,
                role: dto.role,
            },
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
}
