// --- [Thư viện] ---
import { IsNotEmpty, IsObject } from 'class-validator';

// --- [DTO: Tạo mới bài viết] ---
export class CreatePostDto {
  /**
   * Tiêu đề bài viết
   */
  @IsNotEmpty()
  title: string;

  /**
   * Mô tả ngắn bài viết
   */
  @IsNotEmpty()
  description: string;

  /**
   * Nội dung chính bài viết
   */
  @IsNotEmpty()
  content: string;

  /**
   * Ảnh đại diện bài viết
   */
  @IsObject()
  @IsNotEmpty()
  cover: {
    mediaCode: string;
    url: string;
  };
}
