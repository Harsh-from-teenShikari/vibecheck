import { Controller, Get, Post, Body, Logger, UseGuards } from '@nestjs/common';
import { ControlPlaneService } from './control-plane.service';

@Controller('control-plane')
export class ControlPlaneController {
    private readonly logger = new Logger(ControlPlaneController.name);

    constructor(private readonly controlPlaneService: ControlPlaneService) { }

    @Get('metrics/drift')
    async getDriftMetrics() {
        return await this.controlPlaneService.getSystemDriftMetrics();
    }

    @Get('audit/logs')
    async getAuditLogs() {
        return await this.controlPlaneService.getRecentAuditLogs();
    }

    @Post('override')
    async triggerManualOverride(@Body() body: { operatorId: string, entityId: string, action: string, justification: string }) {
        this.logger.warn(`Rest Endpoint Triggered: Manual Override by ${body.operatorId}`);
        return await this.controlPlaneService.logOperatorOverride(body.operatorId, body.entityId, body.action, body.justification);
    }
}
