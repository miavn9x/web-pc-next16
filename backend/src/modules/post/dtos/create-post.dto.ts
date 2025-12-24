// --- [Thư viện] ---
import { IsNotEmpty, IsObject } from 'class-validator';

// --- [DTO: Tạo mới bài viết] ---
export class CreatePostDto {
  /**
   * Tiêu đề bài viết (đa ngôn ngữ)
   */
  @IsObject()
  @IsNotEmpty()
  title: {
    vi: string;
    ja: string;
  };

  /**
   * Mô tả ngắn bài viết (đa ngôn ngữ)
   */
  @IsObject()
  @IsNotEmpty()
  description: {
    vi: string;
    ja: string;
  };

  /**
   * Nội dung chính bài viết (đa ngôn ngữ)
   */
  @IsObject()
  @IsNotEmpty()
  content: {
    vi: string;
    ja: string;
  };

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
