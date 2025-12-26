import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { AdvertisementPosition } from '../enums/advertisement-position.enum';

export type AdvertisementDocument = Advertisement & Document;

@Schema({ timestamps: true, collection: 'advertisements' })
export class Advertisement {
  @Prop({ required: true, unique: true })
  code: string;

  @Prop({ required: true })
  title: string; // Tên gợi nhớ

  @Prop({ enum: AdvertisementPosition, required: true })
  position: AdvertisementPosition;

  @Prop({
    required: true,
    type: {
      mediaCode: { type: String, required: true },
      url: { type: String, required: true },
    },
    _id: false,
  })
  media: {
    mediaCode: string;
    url: string;
  };

  @Prop({ default: '' })
  link: string; // Link khi click vào ảnh

  @Prop({ default: true })
  isActive: boolean;

  @Prop({ default: 0 })
  priority: number; // Ưu tiên hiển thị (số lớn hiện trước)

  @Prop({ type: Date })
  createdAt: Date;

  @Prop({ type: Date })
  updatedAt: Date;
}

export const AdvertisementSchema = SchemaFactory.createForClass(Advertisement);
AdvertisementSchema.index({ position: 1, isActive: 1, priority: -1 });
