// --- [Thư viện] ---
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

// --- [MultilangString] ---
@Schema({ _id: false })
class MultilangString {
  @Prop({ required: true, default: '' })
  vi: string;

  @Prop({ required: true, default: '' })
  ja: string;
}

// --- [Kiểu dữ liệu Document] ---
export type PostDocument = Post & Document;

// --- [Schema chính: Post] ---
@Schema({ timestamps: true, collection: 'posts' })
export class Post {
  /**
   * Mã định danh bài viết (dạng code duy nhất)
   */
  @Prop({ required: true, unique: true })
  code: string;

  /**
   * Tiêu đề bài viết
   */
  @Prop({ type: MultilangString, required: true })
  title: MultilangString;

  /**
   * Mô tả ngắn của bài viết
   */
  @Prop({ type: MultilangString, required: true })
  description: MultilangString;

  /**
   * Nội dung chính của bài viết
   */
  @Prop({ type: MultilangString, required: true })
  content: MultilangString;

  /**
   * Ảnh đại diện bài viết
   * Bao gồm mã media và đường dẫn URL
   */
  @Prop({
    required: true,
    type: {
      mediaCode: { type: String, required: true },
      url: { type: String, required: true },
    },
    _id: false,
  })
  cover: {
    mediaCode: string;
    url: string;
  };

  // Ngày tạo
  @Prop({ type: Date })
  createdAt: Date;

  // Ngày cập nhật gần nhất
  @Prop({ type: Date })
  updatedAt: Date;
}

// --- [Tạo Schema Mongoose từ class] ---
export const PostSchema = SchemaFactory.createForClass(Post);
