import { PartialType } from '@nestjs/mapped-types';
import { CreateProductDto } from './create-product.dto';

// --- [UpdateProductDto] ---
export class UpdateProductDto extends PartialType(CreateProductDto) {}
