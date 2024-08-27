import { Module } from '@nestjs/common';
import { CommonService } from './common.service';
import { MailerModule } from '@nestjs-modules/mailer';
import { ConfigModule } from '@nestjs/config';

@Module({
  providers: [CommonService],
  exports: [CommonService],
  imports: [
    ConfigModule.forRoot(),
    MailerModule.forRoot({
      transport: {
        host: process.env.HOST,
        secure: false,
        port: process.env.PORT,
        auth: {
          user: process.env.USER,
          pass: process.env.PASS,
        },
      },
    }),
  ],
})
export class CommonModule {}
