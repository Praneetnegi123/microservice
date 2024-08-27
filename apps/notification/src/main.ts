import { NestFactory } from '@nestjs/core';
import { NotificationModule } from './notification.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { ValidationPipe } from '@nestjs/common';
import { ResponseInterceptor } from '@app/common/commonRes.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(NotificationModule);

  const notificationMicroservice =
    await NestFactory.createMicroservice<MicroserviceOptions>(
      NotificationModule,
      // {
      //   transport: Transport.RMQ,
      //   options: {
      //     urls: [process.env.RabbitMQ_URL],
      //     queue: 'notification_queue',
      //     queueOptions: {
      //       durable: false,
      //     },
      //   },
      // },
    );
  notificationMicroservice.listen();
  console.log('notification service is started');
  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalInterceptors(new ResponseInterceptor());

  await app.listen(process.env.NOTIFICATION_MICROSERVICE_PORT);
  app.enableCors();
}
bootstrap();
