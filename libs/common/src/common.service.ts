import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';

@Injectable()
export class CommonService {
  constructor(private readonly mailService: MailerService) {}

  sendMail(mailObject) {

    this.mailService.sendMail({
      from: 'praneet_negi@softprodigy.com',
      to: mailObject.to,
      subject: mailObject.subject,
      text: mailObject.message,
    });
  }
}
