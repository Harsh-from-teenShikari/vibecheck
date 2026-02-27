import { IsString, IsEmail, IsEnum, IsNumber, IsOptional } from 'class-validator';
import { UserRole, KycStatus } from '@prisma/client';

export class CreateUserDto {
    @IsEmail()
    email: string;

    @IsEnum(UserRole)
    role: UserRole;
}

export class CreateCreatorProfileDto {
    @IsString()
    userId: string;

    @IsString()
    niche: string;

    @IsString()
    region: string;

    @IsNumber()
    followers: number;
}
