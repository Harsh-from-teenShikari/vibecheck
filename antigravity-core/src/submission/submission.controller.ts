import { Controller, Get, Post, Patch, Body, Param, UsePipes, ValidationPipe } from '@nestjs/common';
import { SubmissionService } from './submission.service';
import { CreateSubmissionDto } from './dto/create-submission.dto';

@Controller('submission')
export class SubmissionController {
    constructor(private readonly submissionService: SubmissionService) { }

    @Get('flagged')
    async getFlaggedSubmissions() {
        return await this.submissionService.getFlaggedSubmissions();
    }

    @Get()
    async getCreatorSubmissions() {
        return await this.submissionService.getCreatorSubmissions();
    }

    @Patch(':id/verify')
    async verifySubmission(@Param('id') id: string, @Body('status') status: 'approved' | 'rejected') {
        return await this.submissionService.verifySubmission(id, status);
    }

    @Post()
    @UsePipes(new ValidationPipe({ transform: true }))
    async createSubmission(@Body() createSubmissionDto: CreateSubmissionDto) {
        return await this.submissionService.createSubmission(createSubmissionDto);
    }
}
