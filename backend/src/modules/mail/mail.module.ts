// Backend - Mail Module với Contact Controller
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ContactController } from './controller/contact.controller';
import { MailService } from './service/send-mail.service';

@Module({
  imports: [ConfigModule],
  controllers: [ContactController],
  providers: [MailService],
  exports: [MailService],
})
export class MailModule {}
