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
Object.defineProperty(exports, "__esModule", { value: true });
exports.SubmissionController = void 0;
const common_1 = require("@nestjs/common");
const submission_service_1 = require("./submission.service");
const create_submission_dto_1 = require("./dto/create-submission.dto");
let SubmissionController = class SubmissionController {
    submissionService;
    constructor(submissionService) {
        this.submissionService = submissionService;
    }
    async getFlaggedSubmissions() {
        return await this.submissionService.getFlaggedSubmissions();
    }
    async getCreatorSubmissions() {
        return await this.submissionService.getCreatorSubmissions();
    }
    async verifySubmission(id, status) {
        return await this.submissionService.verifySubmission(id, status);
    }
    async createSubmission(createSubmissionDto) {
        return await this.submissionService.createSubmission(createSubmissionDto);
    }
};
exports.SubmissionController = SubmissionController;
__decorate([
    (0, common_1.Get)('flagged'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], SubmissionController.prototype, "getFlaggedSubmissions", null);
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], SubmissionController.prototype, "getCreatorSubmissions", null);
__decorate([
    (0, common_1.Patch)(':id/verify'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)('status')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], SubmissionController.prototype, "verifySubmission", null);
__decorate([
    (0, common_1.Post)(),
    (0, common_1.UsePipes)(new common_1.ValidationPipe({ transform: true })),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_submission_dto_1.CreateSubmissionDto]),
    __metadata("design:returntype", Promise)
], SubmissionController.prototype, "createSubmission", null);
exports.SubmissionController = SubmissionController = __decorate([
    (0, common_1.Controller)('submission'),
    __metadata("design:paramtypes", [submission_service_1.SubmissionService])
], SubmissionController);
//# sourceMappingURL=submission.controller.js.map