import { CreateProductDto } from '../dtos/create-product.dto';
import { UpdateProductDto } from '../dtos/update-product.dto';

export const validCategories = ['1', '2', '3', '4'];

export function validateName(name: { vi?: string; ja?: string } | undefined) {
  if (!name?.vi || !name?.ja) {
    return {
      valid: false,
      message: 'Thiếu tên sản phẩm',
      errorCode: 'PRODUCT_NAME_REQUIRED',
    };
  }
  return { valid: true };
}

export function validateCategory(category: any) {
  if (!validCategories.includes(String(category))) {
    return {
      valid: false,
      message: 'Danh mục không hợp lệ',
      errorCode: 'INVALID_CATEGORY',
    };
  }
  return { valid: true };
}

export function validateDescription(description: { vi?: string; ja?: string } | undefined) {
  if (!description?.vi || !description?.ja) {
    return {
      valid: false,
      message: 'Thiếu mô tả sản phẩm',
      errorCode: 'PRODUCT_DESCRIPTION_REQUIRED',
    };
  }
  return { valid: true };
}

export function validateCover(cover: { mediaCode?: string; url?: string } | undefined) {
  if (!cover?.mediaCode || !cover?.url) {
    return {
      valid: false,
      message: 'Thiếu ảnh đại diện',
      errorCode: 'COVER_REQUIRED',
    };
  }
  return { valid: true };
}

export function validateGallery(gallery: { mediaCode?: string; url?: string }[] | undefined) {
  if (!Array.isArray(gallery) || gallery.length === 0) {
    return {
      valid: false,
      message: 'Cần ít nhất 1 ảnh trong gallery',
      errorCode: 'GALLERY_REQUIRED',
    };
  }

  for (const item of gallery) {
    if (!item.mediaCode || !item.url) {
      return {
        valid: false,
        message: 'Mỗi ảnh gallery phải có mediaCode và url',
        errorCode: 'GALLERY_ITEM_INVALID',
      };
    }
  }
  return { valid: true };
}

export function validateProductDto(dto: CreateProductDto | UpdateProductDto) {
  let validation = validateName(dto.name);
  if (!validation.valid) return validation;

  validation = validateCategory(dto.category);
  if (!validation.valid) return validation;

  validation = validateDescription(dto.description);
  if (!validation.valid) return validation;

  validation = validateCover(dto.cover);
  if (!validation.valid) return validation;

  validation = validateGallery(dto.gallery);
  if (!validation.valid) return validation;

  return { valid: true };
}
