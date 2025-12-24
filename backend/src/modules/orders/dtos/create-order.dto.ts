// --- [Thư viện] ---
import { Type } from 'class-transformer';
import {
  IsArray,
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsPositive,
  IsString,
  Min,
  ValidateNested,
} from 'class-validator';

// --- [MultilangString DTO] ---
class MultilangStringDto {
  @IsString()
  @IsNotEmpty()
  vi: string;

  @IsString()
  @IsNotEmpty()
  ja: string;
}

// --- [PriceDetail DTO] ---
class PriceDetailDto {
  @IsPositive()
  original: number;

  @Min(0)
  discountPercent: number;
}

// --- [PriceMultilang DTO] ---
class PriceMultilangDto {
  @ValidateNested()
  @Type(() => PriceDetailDto)
  vi: PriceDetailDto;

  @ValidateNested()
  @Type(() => PriceDetailDto)
  ja: PriceDetailDto;
}

// --- [Variant DTO] ---
class VariantDto {
  @ValidateNested()
  @Type(() => MultilangStringDto)
  label: MultilangStringDto;

  @ValidateNested()
  @Type(() => PriceMultilangDto)
  price: PriceMultilangDto;
}

// --- [OrderProduct DTO] ---
class OrderProductDto {
  @IsString()
  @IsNotEmpty()
  productCode: string;

  @ValidateNested()
  @Type(() => VariantDto)
  variant: VariantDto;

  @IsPositive()
  quantity: number;
}

// --- [CreateOrderDto] ---
export class CreateOrderDto {
  @IsString()
  @IsNotEmpty()
  code: string;

  @IsString()
  @IsNotEmpty()
  fullName: string;

  @IsEmail()
  email: string;

  @IsString()
  @IsNotEmpty()
  phone: string;

  @IsString()
  @IsNotEmpty()
  address: string;

  @IsOptional()
  @IsString()
  note?: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => OrderProductDto)
  products: OrderProductDto[];

  @IsOptional()
  @IsString()
  couponCode?: string;
}
