// Backend - Mail Service với Contact và Order
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import type { Transporter } from 'nodemailer';
import * as nodemailer from 'nodemailer';
import { ContactMailData } from '../interface/contact.interface';
import { OrderMailData } from '../interface/order.interface';

@Injectable()
export class MailService {
  private transporter: Transporter;

  constructor(private configService: ConfigService) {
    this.transporter = nodemailer.createTransport({
      host: this.configService.get<string>('MAIL_HOST'),
      port: this.configService.get<number>('MAIL_PORT'),
      secure: false, // true for 465, false for other ports
      auth: {
        user: this.configService.get<string>('MAIL_USER'),
        pass: this.configService.get<string>('MAIL_PASS'),
      },
    });
  }

  // Gửi email liên hệ từ khách hàng
  async sendContactNotification(contact: ContactMailData): Promise<void> {
    const emailContent = `
      <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; border: 1px solid #ddd; border-radius: 8px; overflow: hidden;">
        <div style="background-color: #f8f8f8; padding: 20px; text-align: center; border-bottom: 1px solid #eee;">
          <h2 style="color: #333; margin: 0;">📧 Liên hệ mới từ website!</h2>
        </div>
        <div style="padding: 20px;">
          <p style="font-size: 16px;">Xin chào,</p>
          <p style="font-size: 16px;">Bạn có một liên hệ mới từ website. Dưới đây là chi tiết:</p>
          
          <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
            <tr>
              <td style="padding: 8px 0; border-bottom: 1px solid #eee; font-weight: bold; width: 30%;">Họ tên:</td>
              <td style="padding: 8px 0; border-bottom: 1px solid #eee;"><strong>${contact.fullName}</strong></td>
            </tr>
            <tr>
              <td style="padding: 8px 0; border-bottom: 1px solid #eee; font-weight: bold;">Email:</td>
              <td style="padding: 8px 0; border-bottom: 1px solid #eee;">${contact.email}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; border-bottom: 1px solid #eee; font-weight: bold;">Số điện thoại:</td>
              <td style="padding: 8px 0; border-bottom: 1px solid #eee;">${contact.phone}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; border-bottom: 1px solid #eee; font-weight: bold;">Địa chỉ:</td>
              <td style="padding: 8px 0; border-bottom: 1px solid #eee;">${contact.address}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; border-bottom: 1px solid #eee; font-weight: bold;">Chủ đề:</td>
              <td style="padding: 8px 0; border-bottom: 1px solid #eee;"><strong>${contact.subject}</strong></td>
            </tr>
          </table>

          <div style="background-color: #f9f9f9; padding: 15px; border-radius: 5px; margin-bottom: 20px;">
            <h4 style="margin: 0 0 10px 0; color: #333;">Nội dung tin nhắn:</h4>
            <p style="margin: 0; font-style: italic; color: #555;">${contact.content}</p>
          </div>

          <p style="font-size: 14px; color: #666;">Vui lòng phản hồi khách hàng trong thời gian sớm nhất.</p>
        </div>
        <div style="background-color: #f8f8f8; padding: 15px; text-align: center; border-top: 1px solid #eee; font-size: 12px; color: #777;">
          <p>&copy; ${new Date().getFullYear()} <a href="https://wfourtech.vn/" style="color: #3498db; text-decoration: none;">W-Four Tech</a>. All rights reserved.</p>
        </div>
      </div>
    `;

    await this.transporter.sendMail({
      from: '"CSKH W-Four Tech" <wfour.cskh@gmail.com>',
      to: 'trminhhieu.personal@gmail.com',
      subject: `📧 Liên hệ mới: ${contact.subject}`,
      html: emailContent,
    });
  }

  // Gửi email thông báo đơn hàng mới
  async sendOrderNotification(order: OrderMailData): Promise<void> {
    const emailContent = `
      <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; border: 1px solid #ddd; border-radius: 8px; overflow: hidden;">
        <div style="background-color: #f8f8f8; padding: 20px; text-align: center; border-bottom: 1px solid #eee;">
          <h2 style="color: #333; margin: 0;">🛒 Đơn hàng mới vừa được đặt!</h2>
        </div>
        <div style="padding: 20px;">
          <p style="font-size: 16px;">Xin chào,</p>
          <p style="font-size: 16px;">Một đơn hàng mới đã được đặt trên hệ thống của bạn. Dưới đây là chi tiết đơn hàng:</p>
          
          <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
            <tr>
              <td style="padding: 8px 0; border-bottom: 1px solid #eee; font-weight: bold; width: 30%;">Mã đơn hàng:</td>
              <td style="padding: 8px 0; border-bottom: 1px solid #eee;"><strong>${order.code}</strong></td>
            </tr>
            <tr>
              <td style="padding: 8px 0; border-bottom: 1px solid #eee; font-weight: bold;">Khách hàng:</td>
              <td style="padding: 8px 0; border-bottom: 1px solid #eee;">${order.email} - ${order.phone}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; border-bottom: 1px solid #eee; font-weight: bold;">Địa chỉ giao hàng:</td>
              <td style="padding: 8px 0; border-bottom: 1px solid #eee;">${order.shippingAddress}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; border-bottom: 1px solid #eee; font-weight: bold;">Tổng tiền:</td>
              <td style="padding: 8px 0; border-bottom: 1px solid #eee;"><strong style="color: #e67e22;">${order.totalPrice.toLocaleString('vi-VN')} VND</strong></td>
            </tr>
          </table>

          <p style="font-size: 14px; color: #666;">Vui lòng kiểm tra hệ thống để xử lý đơn hàng này.</p>
        </div>
        <div style="background-color: #f8f8f8; padding: 15px; text-align: center; border-top: 1px solid #eee; font-size: 12px; color: #777;">
          <p>&copy; ${new Date().getFullYear()} <a href="https://wfourtech.vn/" style="color: #3498db; text-decoration: none;">W-Four Tech</a>. All rights reserved.</p>
          <p>Nếu bạn có bất kỳ câu hỏi nào, vui lòng liên hệ <a href="https://wfourtech.vn/" style="color: #3498db; text-decoration: none;">W-Four Tech</a>.</p>
        </div>
      </div>
    `;

    await this.transporter.sendMail({
      from: '"CSKH W-Four Tech" <wfour.cskh@gmail.com>',
      to: 'trminhhieu.personal@gmail.com',
      subject: `🛒 Đơn hàng mới: ${order.code}`,
      html: emailContent,
    });
  }
}
