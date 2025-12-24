// --- Imports ---
import { Type } from 'class-transformer';
import {
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsObject,
  IsString,
  Max,
  Min,
  ValidateNested,
} from 'class-validator';

// --- [MultilangStringDto] ---
class MultilangStringDto {
  @IsString()
  @IsNotEmpty()
  vi: string;

  @IsString()
  @IsNotEmpty()
  ja: string;
}

// --- [PriceDetailDto] ---
class PriceDetailDto {
  @IsNumber()
  @Min(0)
  original: number;

  @IsNumber()
  @Min(0)
  @Max(100)
  discountPercent: number;
}

// --- [PriceMultilangDto] ---
class PriceMultilangDto {
  @ValidateNested()
  @Type(() => PriceDetailDto)
  vi: PriceDetailDto;

  @ValidateNested()
  @Type(() => PriceDetailDto)
  ja: PriceDetailDto;
}

// --- [VariantDto] ---
class VariantDto {
  @ValidateNested()
  @Type(() => MultilangStringDto)
  label: MultilangStringDto;

  @ValidateNested()
  @Type(() => PriceMultilangDto)
  price: PriceMultilangDto;
}

// --- [GalleryItemDto] ---
class GalleryItemDto {
  @IsString()
  mediaCode: string;

  @IsString()
  url: string;
}

// --- [CreateProductDto] ---
export class CreateProductDto {
  @IsNumber()
  category: number;

  @ValidateNested()
  @Type(() => MultilangStringDto)
  name: MultilangStringDto;

  @ValidateNested()
  @Type(() => MultilangStringDto)
  description: MultilangStringDto;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => GalleryItemDto)
  gallery: GalleryItemDto[];

  @IsObject()
  @ValidateNested()
  @Type(() => GalleryItemDto)
  cover: GalleryItemDto;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => VariantDto)
  variants: VariantDto[];
}
