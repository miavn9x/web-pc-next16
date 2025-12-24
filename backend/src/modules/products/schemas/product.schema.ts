// --- [Thư viện] ---
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type ProductDocument = Product & Document;

// --- [Danh mục sản phẩm đa ngôn ngữ] ---
const ProductCategoryEnum = {
  1: { vi: 'banh-trang', ja: 'バインチャン' },
  2: { vi: 'cac-loai-kho', ja: '乾物類' },
  3: { vi: 'do-an-vat', ja: 'スナック' },
  4: { vi: 'trai-cay', ja: '果物' },
} as const;

export const ProductCategoryKeys = Object.keys(ProductCategoryEnum);

// --- [Schema phụ trợ] ---

// --- [MultilangString] ---
@Schema({ _id: false })
class MultilangString {
  // Giá trị tiếng Việt
  @Prop({ required: true, default: '' })
  vi: string;

  // Giá trị tiếng Nhật
  @Prop({ required: true, default: '' })
  ja: string;
}

// --- [PriceDetail SubSchema] ---
@Schema({ _id: false })
class PriceDetail {
  // Giá gốc của biến thể
  @Prop({ required: true, min: 0, default: 0 })
  original: number;

  // Phần trăm giảm giá (0–100)
  @Prop({ required: true, min: 0, max: 100, default: 0 })
  discountPercent: number;
}

// --- [PriceMultilang] ---
@Schema({ _id: false })
class PriceMultilang {
  // Giá và giảm giá tiếng Việt
  @Prop({ type: PriceDetail, required: true })
  vi: PriceDetail;

  // Giá và giảm giá tiếng Nhật
  @Prop({ type: PriceDetail, required: true })
  ja: PriceDetail;
}

// --- [Variant] ---
@Schema({ _id: false })
class Variant {
  // Tên hiển thị biến thể (đa ngôn ngữ)
  @Prop({ type: MultilangString, required: true })
  label: MultilangString;

  // Giá bán theo từng ngôn ngữ
  @Prop({ type: PriceMultilang, required: true })
  price: PriceMultilang;
}

// --- [Schema chính] ---

@Schema({ timestamps: true, collection: 'products' })
export class Product {
  // Danh mục sản phẩm (đa ngôn ngữ - chỉ cần truyền key)
  @Prop({
    type: Number,
    required: true,
    validate: {
      validator: (value: number) => ProductCategoryKeys.includes(String(value)),
      message: () => `Danh mục không hợp lệ`,
    },
  })
  category: number;

  // Mã sản phẩm duy nhất
  @Prop({ required: true, unique: true })
  productCode: string;

  // Tên sản phẩm (đa ngôn ngữ)
  @Prop({ type: MultilangString, required: true })
  name: MultilangString;

  // Mô tả chi tiết sản phẩm (đa ngôn ngữ)
  @Prop({ type: MultilangString, required: true })
  description: MultilangString;

  // Danh sách ảnh minh hoạ
  @Prop({ type: [Object], required: true })
  gallery: {
    mediaCode: string;
    url: string;
  }[];

  // Ảnh đại diện chính
  @Prop({ required: true, type: Object })
  cover: {
    mediaCode: string;
    url: string;
  };

  // Khoảng giá từ các biến thể (min-max)
  @Prop({
    type: {
      vi: { min: String, max: String },
      ja: { min: String, max: String },
    },
    required: true,
    _id: false,
  })
  priceRange: {
    vi: { min: string; max: string };
    ja: { min: string; max: string };
  };

  // Danh sách các biến thể của sản phẩm
  @Prop({ type: [Variant], required: true })
  variants: Variant[];

  // Token tìm kiếm (đa ngôn ngữ)
  @Prop({
    type: {
      vi: [String],
      ja: [String],
    },
    required: true,
    default: { vi: [], ja: [] },
    _id: false,
  })
  tokens: {
    vi: string[];
    ja: string[];
  };

  // Ngày tạo
  @Prop({ type: Date })
  createdAt: Date;

  // Ngày cập nhật gần nhất
  @Prop({ type: Date })
  updatedAt: Date;
}

export const ProductSchema = SchemaFactory.createForClass(Product);
ProductSchema.index({ category: 1, createdAt: -1 });
ProductSchema.index({ category: 1, updatedAt: -1 });

ProductSchema.index({ 'variants.variantCode': 1 });
ProductSchema.index({ 'tokens.vi': 'text', 'tokens.ja': 'text' });
