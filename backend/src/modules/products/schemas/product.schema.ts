import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type ProductDocument = Product & Document;

@Schema({ timestamps: true })
export class Product extends Document {
  @Prop({ required: true, unique: true, uppercase: true })
  productCode: string;

  @Prop({ required: true })
  name: string;

  // === CATEGORY INTEGRATION ===
  @Prop({ required: true })
  categoryCode: string;

  @Prop()
  categorySlug: string;

  @Prop()
  subcategory: string;

  @Prop()
  subcategorySlug: string;

  @Prop({ type: [Object], default: [] })
  categoryPriceRanges: Array<{
    label: string;
    min: number;
    max: number | null;
  }>;

  // === BASIC INFO ===
  @Prop()
  brand?: string;

  @Prop({ required: true, min: 0 })
  price: number;

  @Prop({ min: 0 })
  originalPrice?: number;

  @Prop({ min: 0, max: 100 })
  discount?: number;

  // === MEDIA ===
  @Prop({ type: Object })
  cover: {
    url: string;
    mediaCode: string;
  };

  @Prop({ type: [Object], default: [] })
  gallery: Array<{
    url: string;
    mediaCode: string;
  }>;

  // === SEO ===
  @Prop({ required: true, unique: true })
  slug: string;

  @Prop({ index: 'text' })
  searchKey: string;

  // === DYNAMIC SPECS ===
  @Prop({ type: [Object], default: [] })
  specs: Array<{
    label: string;
    value: string;
    order: number;
    showInListing: boolean;
  }>;

  // === FILTERS (Price Range) ===
  @Prop({ type: Object, default: {} })
  filters: Record<string, any>;

  // === DESCRIPTION ===
  @Prop({ type: String })
  description: string;

  @Prop({ type: String })
  content: string;

  // === STATUS ===
  @Prop({ default: true })
  isActive: boolean;

  @Prop({ default: false })
  isFeatured: boolean;

  @Prop({ default: false })
  isNewArrival: boolean;

  @Prop({ default: false })
  isBuildPc: boolean;

  @Prop({ default: 0 })
  viewCount: number;

  @Prop({ default: 0 })
  soldCount: number;

  createdAt?: Date;
  updatedAt?: Date;
}

export const ProductSchema = SchemaFactory.createForClass(Product);

// Virtual fields
ProductSchema.virtual('discountedPrice').get(function (this: Product) {
  if (this.discount && this.discount > 0) {
    return Math.round(this.price * (1 - this.discount / 100));
  }
  return this.price;
});

// Indexes
ProductSchema.index({ productCode: 1 }, { unique: true });
ProductSchema.index({ slug: 1 }, { unique: true });
ProductSchema.index({ categoryCode: 1 });
ProductSchema.index({ searchKey: 'text' });
ProductSchema.index({ price: 1 });
ProductSchema.index({ createdAt: -1 });
ProductSchema.index({ 'specs.label': 1, 'specs.value': 1 });

// Ensure virtuals are included in JSON
ProductSchema.set('toJSON', { virtuals: true });
ProductSchema.set('toObject', { virtuals: true });
