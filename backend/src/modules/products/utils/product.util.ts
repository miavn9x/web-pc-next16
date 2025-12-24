import { Model } from 'mongoose';
import { CreateProductDto } from '../dtos/create-product.dto';
import { UpdateProductDto } from '../dtos/update-product.dto';
import { Variant } from '../interfaces/product.interface';
import { ProductDocument } from '../schemas/product.schema';

// --- [Tiện ích xử lý] ---
export function getMinMax(variants: Variant[], lang: 'vi' | 'ja') {
  let min = Infinity;
  let max = -Infinity;
  for (const v of variants) {
    const price = v.price?.[lang]?.original * (1 - v.price?.[lang]?.discountPercent / 100);
    if (price < min) min = price;
    if (price > max) max = price;
  }
  return {
    min: min.toFixed(0),
    max: max.toFixed(0),
  };
}

export function tokenize(text: string) {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .split(/\s+/)
    .filter(Boolean);
}

export function validateVariants(variants: Variant[]) {
  const viLabels = new Set<string>();
  const jaLabels = new Set<string>();
  for (const variant of variants) {
    if (
      !variant.label?.vi ||
      !variant.label?.ja ||
      !variant.price?.vi ||
      variant.price.vi.original == null ||
      variant.price.vi.discountPercent == null ||
      !variant.price?.ja ||
      variant.price.ja.original == null ||
      variant.price.ja.discountPercent == null
    ) {
      return {
        valid: false,
        errorCode: 'VARIANT_INVALID',
        message: 'Mỗi biến thể cần có đầy đủ label và price',
      };
    }
    if (viLabels.has(variant.label.vi) || jaLabels.has(variant.label.ja)) {
      return {
        valid: false,
        errorCode: 'VARIANT_LABEL_DUPLICATE',
        message: 'Tên biến thể (label) bị trùng',
      };
    }
    viLabels.add(variant.label.vi);
    jaLabels.add(variant.label.ja);
  }
  return { valid: true };
}

// --- [Sinh mã sản phẩm] ---
export async function generateProductCode(model: Model<ProductDocument>): Promise<string> {
  let productCode: string = '';
  let isDuplicate = true;
  while (isDuplicate) {
    const randomDigits = Math.floor(100000 + Math.random() * 900000);
    const now = new Date();
    const ddMMyyyy = now.toLocaleDateString('vi-VN').split('/').join('');
    productCode = `prdt_${ddMMyyyy}_${randomDigits}`;
    const existed = await model.exists({ productCode });
    isDuplicate = !!existed;
  }
  return productCode;
}

export function prepareProductMeta(dto: CreateProductDto | UpdateProductDto) {
  return {
    tokens: {
      vi: tokenize(String(dto.name?.vi || '')),
      ja: tokenize(String(dto.name?.ja || '')),
    },
    priceRange: {
      vi: getMinMax(dto.variants || [], 'vi'),
      ja: getMinMax(dto.variants || [], 'ja'),
    },
  };
}
