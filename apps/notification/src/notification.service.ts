import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';

@Injectable()
export class NotificationService {
  getHello(): string {
    return 'Hello World! from notification microservice/.';
  }

  // send notification fucntion
  sendNotification(mailId: string): string {
    console.log(
      ` FROM user_registered queue => Notification sent to ${mailId}`,
    );
    return 'Hello World!';
  }
}
