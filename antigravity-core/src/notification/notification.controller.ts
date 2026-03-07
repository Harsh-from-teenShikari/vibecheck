import { Controller, Logger } from '@nestjs/common';
import { NotificationService } from './notification.service';

@Controller('notification')
export class NotificationController {
    private readonly logger = new Logger(NotificationController.name);

    constructor(private readonly notificationService: NotificationService) { }
}
