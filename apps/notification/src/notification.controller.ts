import { Controller, Get, UseGuards } from '@nestjs/common';
import { NotificationService } from './notification.service';
import { AuthGuard } from '@app/common';
import { EventPattern, Payload } from '@nestjs/microservices';

@Controller()
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  // @UseGuards(AuthGuard)
  @Get()
  getHello(): string {
    return this.notificationService.getHello();
  }

  @EventPattern('user_registered')
  sendNotification(@Payload() mailId: string): string {
    return this.notificationService.sendNotification(mailId);
  }
}
