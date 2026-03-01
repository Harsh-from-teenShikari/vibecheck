"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var IdentityController_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.IdentityController = void 0;
const common_1 = require("@nestjs/common");
const identity_service_1 = require("./identity.service");
const create_identity_dto_1 = require("./dto/create-identity.dto");
const client_1 = require("@prisma/client");
let IdentityController = IdentityController_1 = class IdentityController {
    identityService;
    logger = new common_1.Logger(IdentityController_1.name);
    constructor(identityService) {
        this.identityService = identityService;
    }
    async register(createUserDto) {
        this.logger.log(`Received registration request for: ${createUserDto.email}`);
        try {
            const user = await this.identityService.createUser(createUserDto);
            if (user.role === client_1.UserRole.creator) {
                await this.identityService.createCreatorProfile({
                    userId: user.id,
                    niche: 'GENERAL',
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
                accessToken: `mock-jwt-token-for-${user.id}`,
            };
        }
        catch (error) {
            this.logger.error(`Registration failed: ${error.message}`);
            if (error.code === 'P2002') {
                throw new common_1.HttpException('Email already exists', common_1.HttpStatus.CONFLICT);
            }
            throw new common_1.HttpException('Internal server error', common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async login(body) {
        const { email, password } = body;
        this.logger.log(`Received login request for: ${email}`);
        return {
            message: 'Login successful',
            user: {
                id: 'mock-user-id',
                email: email,
                role: 'CREATOR',
            },
            accessToken: 'mock-jwt-token',
        };
    }
    async getAllUsers() {
        return await this.identityService.getAllUsers();
    }
};
exports.IdentityController = IdentityController;
__decorate([
    (0, common_1.Post)('register'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_identity_dto_1.CreateUserDto]),
    __metadata("design:returntype", Promise)
], IdentityController.prototype, "register", null);
__decorate([
    (0, common_1.Post)('login'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], IdentityController.prototype, "login", null);
__decorate([
    (0, common_1.Get)('users'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], IdentityController.prototype, "getAllUsers", null);
exports.IdentityController = IdentityController = IdentityController_1 = __decorate([
    (0, common_1.Controller)('identity'),
    __metadata("design:paramtypes", [identity_service_1.IdentityService])
], IdentityController);
//# sourceMappingURL=identity.controller.js.map