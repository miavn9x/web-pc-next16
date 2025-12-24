import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type CouponDocument = Coupon & Document;

@Schema({ _id: false })
export class MultilangString {
  @Prop({ required: true, default: '' })
  vi: string;

  @Prop({ required: true, default: '' })
  ja: string;
}

@Schema({ _id: false })
export class MultilangValue {
  @Prop({ required: true, min: 0 })
  vi: number;

  @Prop({ required: true, min: 0 })
  ja: number;
}

@Schema({ timestamps: true, collection: 'coupons' })
export class Coupon {
  @Prop({ required: true, unique: true, uppercase: true, trim: true })
  code: string;

  @Prop({ required: true, type: MultilangString })
  name: MultilangString; // Tên chương trình giảm giá đa ngôn ngữ

  @Prop({ required: true, enum: ['percent', 'fixed'], default: 'percent' })
  type: string;

  @Prop({ required: true, type: MultilangValue })
  value: MultilangValue;

  @Prop({ required: true, min: 1 })
  limit: number; // Giới hạn số lượng mã

  @Prop({ default: 0, min: 0 })
  used: number; // Số lượng đã sử dụng

  @Prop({ default: true })
  isActive: boolean;

  @Prop({ type: Date })
  expiryDate?: Date;
}

export const CouponSchema = SchemaFactory.createForClass(Coupon);
