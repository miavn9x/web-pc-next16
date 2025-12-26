import {
  IsBoolean,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { AdvertisementPosition } from '../enums/advertisement-position.enum';

class MediaDto {
  @IsString()
  @IsNotEmpty()
  mediaCode: string;

  @IsString()
  @IsNotEmpty()
  url: string;
}

export class CreateAdvertisementDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsEnum(AdvertisementPosition)
  @IsNotEmpty()
  position: AdvertisementPosition;

  @IsObject()
  @ValidateNested()
  @Type(() => MediaDto)
  media: MediaDto;

  @IsString()
  @IsOptional()
  link?: string;

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;

  @IsNumber()
  @IsOptional()
  priority?: number;
}
