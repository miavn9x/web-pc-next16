import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

export type CategoryDocument = Category & Document;

/**
 * Schema cho khoảng giá của danh mục
 * Sử dụng cho danh mục cha để lọc sản phẩm theo giá
 */
@Schema({ _id: false })
export class PriceRange {
  @Prop({ required: true })
  label: string;

  @Prop({ required: true, min: 0 })
  min: number;

  @Prop({ type: Number, default: null })
  max: number | null;
}

/**
 * Schema cho danh mục sản phẩm
 * Hỗ trợ cấu trúc phân cấp không giới hạn với children lồng nhau
 */
@Schema({ timestamps: true, collection: 'categories' })
export class Category {
  @Prop({ required: true, unique: true })
  code: string;

  @Prop({ required: true })
  name: string;

  @Prop({ required: true, unique: true })
  slug: string;

  @Prop({ type: [PriceRange], default: [] })
  priceRanges: PriceRange[];

  @Prop({ type: [Object], default: [] })
  children: Category[];

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Category', default: null })
  parentId: MongooseSchema.Types.ObjectId | null;

  @Prop({ default: true })
  isActive: boolean;

  @Prop({ type: String, default: null })
  icon: string | null;
}

export const CategorySchema = SchemaFactory.createForClass(Category);

// Indexes
CategorySchema.index({ code: 1 }, { unique: true });
CategorySchema.index({ slug: 1 }, { unique: true });
CategorySchema.index({ parentId: 1 });
