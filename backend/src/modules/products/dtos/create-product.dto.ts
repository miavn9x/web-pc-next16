import {
  IsString,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsArray,
  IsObject,
  Min,
  Max,
  IsBoolean,
} from 'class-validator';

export class CreateProductDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  categoryCode: string;

  @IsString()
  @IsOptional()
  brand?: string;

  @IsNumber()
  @Min(0)
  price: number;

  @IsNumber()
  @Min(0)
  @IsOptional()
  originalPrice?: number;

  @IsNumber()
  @Min(0)
  @Max(100)
  @IsOptional()
  discount?: number;

  @IsObject()
  @IsOptional()
  cover?: {
    url: string;
    mediaCode: string;
  };

  @IsArray()
  @IsOptional()
  gallery?: Array<{
    url: string;
    mediaCode: string;
  }>;

  @IsArray()
  @IsOptional()
  specs?: Array<{
    label: string;
    value: string;
    showInListing: boolean;
  }>;

  @IsObject()
  @IsOptional()
  filters?: Record<string, any>;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsOptional()
  content?: string;

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;

  @IsBoolean()
  @IsOptional()
  @IsBoolean()
  @IsOptional()
  isFeatured?: boolean;

  @IsBoolean()
  @IsOptional()
  isNewArrival?: boolean;

  @IsBoolean()
  @IsOptional()
  isBuildPc?: boolean;
}
