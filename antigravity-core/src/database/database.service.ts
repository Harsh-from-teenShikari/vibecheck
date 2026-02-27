import { Injectable, Logger } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class DatabaseService extends PrismaClient {
    private readonly logger = new Logger(DatabaseService.name);

    constructor() {
        super({
            log: ['error', 'warn'],
        });
    }

    async onModuleInit() {
        await this.$connect();
        this.logger.log('Prisma Connected to PostgreSQL');
    }

    async onModuleDestroy() {
        await this.$disconnect();
        this.logger.log('Prisma Disconnected');
    }
}
