import { Injectable, Logger } from '@nestjs/common';
import { PrismaClient } from '.prisma/client';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';

@Injectable()
export class DatabaseService extends PrismaClient {
    private readonly logger = new Logger(DatabaseService.name);

    constructor() {
        const connectionString = process.env.DATABASE_URL;
        if (!connectionString) {
            throw new Error("CRITICAL: process.env.DATABASE_URL is undefined inside DatabaseService!");
        }
        const pool = new Pool({ connectionString });
        const adapter = new PrismaPg(pool);
        super({
            adapter,
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
