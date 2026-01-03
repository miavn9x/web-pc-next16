import { Type } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Min,
  ValidateNested,
} from 'class-validator';

/**
 * DTO cho khoảng giá
 * Dùng trong danh mục cha để định nghĩa các khoảng giá lọc sản phẩm
 */
export class PriceRangeDto {
  @IsString()
  @IsNotEmpty()
  label: string;

  @IsNumber()
  @Min(0)
  min: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  max: number | null;
}

/**
 * DTO để tạo danh mục mới
 * Hỗ trợ tạo cấu trúc phân cấp với children lồng nhau không giới hạn
 */
export class CreateCategoryDto {
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  code?: string;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  slug?: string;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => PriceRangeDto)
  priceRanges?: PriceRangeDto[];

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateCategoryDto)
  children?: CreateCategoryDto[];

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @IsOptional()
  @IsString()
  icon?: string;
}
