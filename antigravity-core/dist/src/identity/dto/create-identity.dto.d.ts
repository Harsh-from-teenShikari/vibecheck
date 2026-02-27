import { UserRole } from '@prisma/client';
export declare class CreateUserDto {
    email: string;
    role: UserRole;
    password?: string;
    name?: string;
}
export declare class CreateCreatorProfileDto {
    userId: string;
    niche: string;
    region: string;
    followers: number;
}
