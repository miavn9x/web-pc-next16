// --- Import Thư Viện ---
import { IsEmail, IsNotEmpty } from 'class-validator';

// --- DTO Đăng Ký Người Dùng ---
export class RegisterDto {
  /**
   * Địa chỉ email người dùng — bắt buộc, định dạng hợp lệ.
   */
  @IsEmail({}, { message: 'Email không hợp lệ' })
  @IsNotEmpty({ message: 'Email không được bỏ trống' })
  email: string;

  /**
   * Mật khẩu người dùng — bắt buộc, không được để trống.
   */
  @IsNotEmpty({ message: 'Mật khẩu không được bỏ trống' })
  password: string;

  /**
   * Mã ID của Captcha (được gửi từ server khi client request lấy captcha)
   */
  @IsNotEmpty({ message: 'Captcha ID không được để trống' })
  captchaId: string;

  /**
   * Mã Code người dùng nhập vào để xác thực
   */
  @IsNotEmpty({ message: 'Mã xác nhận không được để trống' })
  captchaCode: string;
}
