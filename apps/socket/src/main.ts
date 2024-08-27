import { NestFactory } from '@nestjs/core';
import { SocketModule } from './socket.module';
import { ValidationPipe } from '@nestjs/common';
import { ResponseInterceptor } from '@app/common/commonRes.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(SocketModule);
  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalInterceptors(new ResponseInterceptor());
  console.log('Socket is listing at port 3002');
  await app.listen(process.env.SOCKET_MICROSERVICE_PORT);
}
bootstrap();
