// Backend - DTO cho Contact
import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class SendContactDto {
  @IsNotEmpty({ message: 'Họ tên không được để trống' })
  @IsString({ message: 'Họ tên phải là chuỗi' })
  @MinLength(2, { message: 'Họ tên phải có ít nhất 2 ký tự' })
  fullName: string;

  @IsNotEmpty({ message: 'Số điện thoại không được để trống' })
  @IsString({ message: 'Số điện thoại phải là chuỗi' })
  phone: string;

  @IsNotEmpty({ message: 'Email không được để trống' })
  @IsEmail({}, { message: 'Email không hợp lệ' })
  email: string;

  @IsNotEmpty({ message: 'Địa chỉ không được để trống' })
  @IsString({ message: 'Địa chỉ phải là chuỗi' })
  address: string;

  @IsNotEmpty({ message: 'Chủ đề không được để trống' })
  @IsString({ message: 'Chủ đề phải là chuỗi' })
  @MinLength(5, { message: 'Chủ đề phải có ít nhất 5 ký tự' })
  subject: string;

  @IsNotEmpty({ message: 'Nội dung không được để trống' })
  @IsString({ message: 'Nội dung phải là chuỗi' })
  @MinLength(10, { message: 'Nội dung phải có ít nhất 10 ký tự' })
  content: string;
}
