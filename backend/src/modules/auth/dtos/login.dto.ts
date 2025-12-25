// --- Import Thư Viện ---
import { IsEmail, IsNotEmpty } from 'class-validator';

// --- DTO Đăng Nhập Người Dùng ---
export class LoginDto {
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
  @IsNotEmpty({ message: 'Mật khẩu không được bỏ trống' })
  password: string;

  /**
   * Mã Captcha người dùng nhập
   */
  @IsNotEmpty({ message: 'Mã xác nhận không được bỏ trống' })
  captchaCode: string;

  /**
   * ID của Captcha (để server đối chiếu)
   */
  @IsNotEmpty({ message: 'Captcha ID không được bỏ trống' })
  captchaId: string;
}
