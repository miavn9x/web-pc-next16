// Backend - Contact Controller
import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { SendContactDto } from '../dto/contact.dto';
import { MailService } from '../service/send-mail.service';

@Controller('contact')
export class ContactController {
  constructor(private readonly mailService: MailService) {}

  @Post('send')
  @HttpCode(HttpStatus.OK)
  async sendContact(@Body() sendContactDto: SendContactDto) {
    try {
      await this.mailService.sendContactNotification(sendContactDto);

      return {
        success: true,
        message: 'Gửi liên hệ thành công! Chúng tôi sẽ phản hồi trong thời gian sớm nhất.',
        data: null,
      };
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      return {
        success: false,
        message: 'Có lỗi xảy ra khi gửi liên hệ. Vui lòng thử lại sau.',
        error: errorMessage,
      };
    }
  }
}
