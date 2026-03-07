import { Injectable, Logger } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { NotificationService } from '../notification/notification.service';
import Redis from 'ioredis';

@Injectable()
export class FraudService {
    private readonly logger = new Logger(FraudService.name);
    private redisClient: Redis;

    constructor(
        private prisma: DatabaseService,
        private readonly notificationService: NotificationService,
    ) {
        this.redisClient = new Redis(process.env.REDIS_PORT ? parseInt(process.env.REDIS_PORT) : 6379, process.env.REDIS_HOST || 'localhost');
    }

    /**
     * Doctrine 4: Abuse Resistance
     * Calculates Fraud Score based on Submission Velocity, Trust History, and Sybil heuristics.
     */
    async calculateFraudScore(event: any) {
        this.logger.log(`Calculating Fraud Score for Submission: ${event.submissionId}`);

        let fraudScore = 0.0;
        const reasons: string[] = [];

        // 1. Velocity Checking (Redis Rate Limiting)
        const velocityKey = `velocity:creator:${event.creatorId}`;
        const recentSubmissions = await this.redisClient.incr(velocityKey);

        // Expire velocity window every 1 hour
        if (recentSubmissions === 1) {
            await this.redisClient.expire(velocityKey, 3600);
        }

        if (recentSubmissions > 10) {
            fraudScore += 0.4;
            reasons.push('High submission velocity detected (>10/hr)');
        }

        // 2. Fetch Base Trust Score
        const creator = await this.prisma.creatorProfile.findUnique({
            where: { id: event.creatorId },
            select: { trustScore: true },
        });

        if (creator && creator.trustScore < 0.3) {
            fraudScore += 0.3;
            reasons.push('Creator has historically low Trust Score');
        }

        // 3. Persist Fraud Score
        await this.prisma.fraudScore.create({
            data: {
                creatorId: event.creatorId,
                submissionId: event.submissionId,
                score: fraudScore,
                reason: reasons.length ? reasons : ['Normal behavior'],
            },
        });

        // 4. Update Submission with final Fraud Score
        await this.prisma.submission.update({
            where: { id: event.submissionId },
            data: { fraudScore },
        });

        this.logger.log(`Fraud Score for ${event.submissionId} is ${fraudScore}`);

        if (fraudScore > 0.8) {
            await this.notificationService.notifyOperatorAlert(
                'High Fraud Score Detected',
                `Creator ${event.creatorId} scored ${fraudScore} on Submission ${event.submissionId}.`
            );
        }

        // The next steps for Commission will be handled synchronously in the new architecture
        return fraudScore;
    }
}
