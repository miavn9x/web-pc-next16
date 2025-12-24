import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateProductDto } from '../dtos/create-product.dto';
import { UpdateProductDto } from '../dtos/update-product.dto';
import { Product, ProductDocument } from '../schemas/product.schema';
import {
  validateCategory,
  validateCover,
  validateDescription,
  validateGallery,
  validateName,
  validateProductDto,
} from '../utils/product-validator.util';
import { generateProductCode, prepareProductMeta, validateVariants } from '../utils/product.util';

export class ProductService {
  constructor(
    @InjectModel(Product.name)
    private readonly productModel: Model<ProductDocument>,
  ) {}

  async create(dto: CreateProductDto) {
    // --- [Validate dữ liệu đầu vào] ---

    const validation = validateProductDto(dto);
    if (!validation.valid) return validation;

    if (!dto.variants?.length) {
      return {
        message: 'Cần ít nhất 1 biến thể',
        data: null,
        errorCode: 'VARIANT_REQUIRED',
      };
    }

    // --- [Validate variants] ---
    const variantValidation = validateVariants(dto.variants);
    if (!variantValidation.valid) {
      return {
        message: variantValidation.message,
        data: null,
        errorCode: variantValidation.errorCode,
      };
    }

    // --- [Sinh mã sản phẩm duy nhất] ---
    const productCode = await generateProductCode(this.productModel);

    const meta = prepareProductMeta(dto);
    const priceRange = meta.priceRange;
    const tokens = meta.tokens;

    // --- [Khởi tạo và lưu sản phẩm] ---
    const product = new this.productModel({
      ...dto,
      productCode,
      priceRange,
      tokens,
    });

    try {
      const saved = await product.save();
      return {
        message: 'Tạo sản phẩm thành công',
        data: saved,
        errorCode: null,
      };
    } catch {
      return {
        message: 'Lỗi khi lưu sản phẩm',
        data: null,
        errorCode: 'PRODUCT_SAVE_ERROR',
      };
    }
  }

  async update(productCode: string, dto: UpdateProductDto) {
    // --- [Validate dữ liệu đầu vào nếu có] ---
    if (dto.name) {
      const validation = validateName(dto.name);
      if (!validation.valid) return validation;
    }

    if (dto.category != null) {
      const validation = validateCategory(dto.category);
      if (!validation.valid) return validation;
    }

    if (dto.description) {
      const validation = validateDescription(dto.description);
      if (!validation.valid) return validation;
    }

    if (dto.cover) {
      const validation = validateCover(dto.cover);
      if (!validation.valid) return validation;
    }

    if (dto.gallery) {
      const validation = validateGallery(dto.gallery);
      if (!validation.valid) return validation;
    }

    let priceRange: Product['priceRange'] | undefined = undefined;
    let tokens: Product['tokens'] | undefined = undefined;

    if (dto.variants?.length) {
      // --- [Validate variants] ---
      const variantValidation = validateVariants(dto.variants);
      if (!variantValidation.valid) {
        return {
          message: variantValidation.message,
          data: null,
          errorCode: variantValidation.errorCode,
        };
      }

      const meta = prepareProductMeta(dto);
      priceRange = meta.priceRange;
      tokens = meta.tokens;
    }

    // --- [Cập nhật sản phẩm] ---
    const updateData: Partial<Product> = {
      ...dto,
    };

    if (priceRange?.vi && priceRange?.ja) {
      updateData.priceRange = priceRange;
    }

    if (tokens?.vi?.length && tokens?.ja?.length) {
      updateData.tokens = tokens;
    }

    const updated = await this.productModel
      .findOneAndUpdate({ productCode }, updateData, {
        new: true,
      })
      .lean();

    if (!updated) {
      return {
        message: 'Không tìm thấy sản phẩm',
        data: null,
        errorCode: 'PRODUCT_NOT_FOUND',
      };
    }

    return {
      message: 'Cập nhật sản phẩm thành công',
      data: updated,
      errorCode: null,
    };
  }

  async findAllPaginated(page = 1, limit = 50) {
    const skip = (page - 1) * limit;
    const products = await this.productModel
      .find({}, { _id: 0, productCode: 1, cover: 1, name: 1, priceRange: 1 })
      .skip(skip)
      .limit(limit)
      .lean();

    const total = await this.productModel.countDocuments();

    return {
      message: 'Lấy danh sách sản phẩm thành công',
      data: {
        data: products,
        pagination: {
          currentPage: Number(page),
          totalItems: total,
          totalPages: Math.ceil(total / limit),
          limit: Number(limit),
        },
      },
      errorCode: null,
    };
  }

  async findByCategory(category: number, page = 1, limit = 50) {
    return this.productModel
      .find({ category }, { _id: 0, productCode: 1, cover: 1, name: 1, priceRange: 1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean();
  }

  async findByCode(productCode: string) {
    const product = await this.productModel.findOne({ productCode }, { _id: 0, __v: 0 }).lean();

    if (!product) {
      return {
        message: 'Không tìm thấy sản phẩm',
        data: null,
        errorCode: 'PRODUCT_NOT_FOUND',
      };
    }

    return {
      message: 'Lấy sản phẩm thành công',
      data: product,
      errorCode: null,
    };
  }

  async search(keyword: string) {
    if (!keyword?.trim()) {
      return {
        message: 'Từ khóa tìm kiếm không hợp lệ',
        data: [],
        errorCode: 'INVALID_KEYWORD',
      };
    }

    const normalized = keyword
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '');
    const queryRegex = new RegExp(normalized, 'i');

    const products = await this.productModel
      .find(
        {
          $or: [{ 'tokens.vi': { $in: [queryRegex] } }, { 'tokens.ja': { $in: [queryRegex] } }],
        },
        { _id: 0, productCode: 1, cover: 1, name: 1, priceRange: 1 },
      )
      .limit(100)
      .lean();

    return {
      message: 'Kết quả tìm kiếm',
      data: products,
      errorCode: null,
    };
  }

  async delete(productCode: string) {
    const deleted = await this.productModel.findOneAndDelete({ productCode }).lean();

    if (!deleted) {
      return {
        message: 'Không tìm thấy sản phẩm để xoá',
        data: null,
        errorCode: 'PRODUCT_NOT_FOUND',
      };
    }

    return {
      message: 'Xoá sản phẩm thành công',
      data: deleted,
      errorCode: null,
    };
  }
}
