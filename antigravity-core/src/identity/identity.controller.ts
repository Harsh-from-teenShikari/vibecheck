import { Controller, Post, Body, HttpException, HttpStatus, Logger, Get } from '@nestjs/common';
import { IdentityService } from './identity.service';
import { CreateUserDto } from './dto/create-identity.dto';
import { UserRole } from '@prisma/client';

// Temporary simplistic auth since there's no official auth module defined yet
// In a production app, we'd use @nestjs/passport and @nestjs/jwt
@Controller('identity')
export class IdentityController {
    private readonly logger = new Logger(IdentityController.name);

    constructor(private readonly identityService: IdentityService) { }

    @Post('register')
    async register(@Body() createUserDto: CreateUserDto) {
        this.logger.log(`Received registration request for: ${createUserDto.email}`);
        try {
            const user = await this.identityService.createUser(createUserDto);

            // If they are a creator, immediately provision a profile
            if (user.role === UserRole.creator) {
                await this.identityService.createCreatorProfile({
                    userId: user.id,
                    niche: 'GENERAL', // Defaults
                    region: 'US',
                    followers: 0,
                });
            }

            return {
                message: 'User registered successfully',
                user: {
                    id: user.id,
                    email: user.email,
                    role: user.role,
                },
                // Mock JWT for local frontend development flow
                accessToken: `mock-jwt-token-for-${user.id}`,
            };
        } catch (error: any) {
            this.logger.error(`Registration failed: ${error.message}`);
            // Prisma P2002 is unique constraint violation
            if (error.code === 'P2002') {
                throw new HttpException('Email already exists', HttpStatus.CONFLICT);
            }
            throw new HttpException('Internal server error', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Post('login')
    async login(@Body() body: any) {
        const { email, password } = body;
        this.logger.log(`Received login request for: ${email}`);

        // In a real app we'd verify the password hash using IdentityService.
        // For this frontend/backend scaffold preview, we accept any password 
        // as long as the email exists in the mock DB or we just mock a success.

        return {
            message: 'Login successful',
            user: {
                id: 'mock-user-id',
                email: email,
                role: 'CREATOR', // Defaulting to CREATOR for local testing if not using real DB check in this mock
            },
            accessToken: 'mock-jwt-token',
        };
    }

    @Get('users')
    async getAllUsers() {
        return await this.identityService.getAllUsers();
    }
}
