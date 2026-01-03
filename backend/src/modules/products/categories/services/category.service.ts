import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Category, CategoryDocument } from '../schemas/category.schema';
import { CreateCategoryDto } from '../dtos/create-category.dto';
import { UpdateCategoryDto } from '../dtos/update-category.dto';
import { generateHierarchicalCode, generateSlugFromName } from '../../utils/string.util';

@Injectable()
export class CategoryService {
  private readonly logger = new Logger(CategoryService.name);

  constructor(@InjectModel(Category.name) private categoryModel: Model<CategoryDocument>) {
    // User explicitly requested to manage data manually.
    // No default seed data is created here.
  }

  // --- [Helper: Thu thập tất cả code và slug từ cấu trúc đệ quy] ---
  private collectAllCodes(dto: CreateCategoryDto, codes: Set<string> = new Set()): Set<string> {
    // Code will be auto-generated if not provided, so we only collect if it exists
    if (dto.code) {
      codes.add(dto.code);
    }
    if (dto.children && dto.children.length > 0) {
      dto.children.forEach(child => this.collectAllCodes(child, codes));
    }
    return codes;
  }

  private collectAllSlugs(dto: CreateCategoryDto, slugs: Set<string> = new Set()): Set<string> {
    // Slug will be auto-generated if not provided, so only collect if it exists
    if (dto.slug) {
      slugs.add(dto.slug);
    }
    if (dto.children && dto.children.length > 0) {
      dto.children.forEach(child => this.collectAllSlugs(child, slugs));
    }
    return slugs;
  }

  // --- [Helper: Kiểm tra code và slug trùng lặp] ---
  private async validateUniqueFields(dto: CreateCategoryDto): Promise<string | null> {
    // Kiểm tra code
    const allCodes = Array.from(this.collectAllCodes(dto));
    const duplicateCodeInRequest = allCodes.find((code, index) => allCodes.indexOf(code) !== index);
    if (duplicateCodeInRequest) {
      return `Code '${duplicateCodeInRequest}' bị trùng lặp trong request`;
    }
    const existingByCode = await this.categoryModel.find({ code: { $in: allCodes } }).lean();
    if (existingByCode.length > 0) {
      return `Code '${existingByCode[0].code}' đã tồn tại trong database`;
    }

    // Kiểm tra slug
    const allSlugs = Array.from(this.collectAllSlugs(dto));

    // Kiểm tra slug trùng trong request
    const duplicateInRequest = allSlugs.find((slug, index) => allSlugs.indexOf(slug) !== index);
    if (duplicateInRequest) {
      return `Slug '${duplicateInRequest}' bị trùng lặp trong request`;
    }

    // Kiểm tra slug trong database
    const existingBySlug = await this.categoryModel.find({ slug: { $in: allSlugs } }).lean();
    if (existingBySlug.length > 0) {
      return `Slug '${existingBySlug[0].slug}' đã tồn tại trong database`;
    }

    return null;
  }

  // --- [Helper: Tạo danh mục đệ quy - chỉ build structure, không save children] ---
  private async createRecursive(
    dto: CreateCategoryDto,
    parentCode?: string, // ← Changed: Pass parent code for hierarchical generation
    isRoot: boolean = true,
  ): Promise<any> {
    // Auto-generate hierarchical code with UUID (guaranteed unique)
    const code = dto.code || generateHierarchicalCode(dto.name, parentCode);
    const slug = dto.slug || generateSlugFromName(dto.name);

    // Build category data
    const categoryData: any = {
      code,
      name: dto.name,
      slug,
      icon: dto.icon || null,
      priceRanges: dto.priceRanges || [],
      isActive: dto.isActive !== undefined ? dto.isActive : true,
      children: [],
    };

    // Only root document has parentId
    if (isRoot) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      categoryData.parentId = null;
    }

    // Recursively build children (không save riêng)
    if (dto.children && dto.children.length > 0) {
      // Validation: Level 1 (Con) chỉ được tối đa 2 children - chỉ check ở root
      if (isRoot && dto.children.length > 2) {
        throw new Error('Danh mục cha chỉ được có tối đa 2 danh mục con (level 1)');
      }

      const childrenData: any[] = [];
      for (const childDto of dto.children) {
        // Children are embedded, pass current code as parent
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        const childData = await this.createRecursive(childDto, code, false);
        childrenData.push(childData);
      }
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      categoryData.children = childrenData;
    }

    // CHỈ save document ở root level
    if (isRoot) {
      const category = new this.categoryModel(categoryData);
      await category.save();
      return category;
    }

    // Children chỉ return plain object, không save
    return categoryData;
  }

  /**
   * Tạo danh mục mới với cấu trúc phân cấp
   *
   * @param dto - Dữ liệu danh mục cần tạo (code và slug sẽ tự động tạo nếu không có)
   * @returns Promise với thông tin danh mục đã tạo
   * @throws Error nếu validation thất bại hoặc trùng code/slug
   *
   * @example
   * ```ts
   * await create({
   *   name: "PC Gaming",
   *   priceRanges: [{key: "duoi-10tr", label: "Dưới 10 triệu", min: 0, max: 10000000}],
   *   children: [{name: "PC Gaming Cao Cấp"}]
   * });
   * ```
   */
  async create(dto: CreateCategoryDto) {
    // Validate code and slug uniqueness
    const validationError = await this.validateUniqueFields(dto);
    if (validationError) {
      return {
        message: validationError,
        data: null,
        errorCode: 'VALIDATION_ERROR',
      };
    }

    try {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      const category = await this.createRecursive(dto);
      return {
        message: 'Tạo danh mục thành công',
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        data: category,
        errorCode: null,
      };
    } catch (error) {
      this.logger.error('Error creating category:', error);
      const errorMessage = error instanceof Error ? error.message : 'Lỗi khi tạo danh mục';
      return {
        message: errorMessage,
        data: null,
        errorCode: 'CREATE_ERROR',
      };
    }
  }

  /**
   * Lấy tất cả danh mục (flat list)
   */
  async findAll() {
    const categories = await this.categoryModel.find().sort({ name: 1 }).lean();
    return {
      message: 'Lấy danh sách danh mục thành công',
      data: categories,
      errorCode: null,
    };
  }

  /**
   * Lấy cây danh mục phân cấp
   * Nếu rootCode được cung cấp, lấy subtree từ category đó
   * Nếu không, lấy tất cả root categories (parentId = null)
   */
  async getCategoryTree(rootCode?: string) {
    try {
      let rootCategories: CategoryDocument[];

      if (rootCode) {
        const rootCategory = await this.categoryModel.findOne({ code: rootCode }).lean();

        if (!rootCategory) {
          return {
            message: 'Không tìm thấy danh mục gốc',
            data: null,
            errorCode: 'CATEGORY_NOT_FOUND',
          };
        }
        rootCategories = [rootCategory as CategoryDocument];
      } else {
        // Lấy root categories (không có parent)
        rootCategories = await this.categoryModel.find({ parentId: null }).sort({ name: 1 }).lean();
      }

      return {
        message: 'Lấy cây danh mục thành công',
        data: rootCategories,
        errorCode: null,
      };
    } catch (error) {
      this.logger.error('Error getting category tree:', error);
      return {
        message: 'Lỗi khi lấy cây danh mục',
        data: null,
        errorCode: 'TREE_ERROR',
      };
    }
  }

  /**
   * Lấy chi tiết một danh mục theo code
   */
  async findOne(code: string) {
    const category = await this.categoryModel.findOne({ code }).lean();
    if (!category) {
      return {
        message: 'Không tìm thấy danh mục',
        data: null,
        errorCode: 'CATEGORY_NOT_FOUND',
      };
    }
    return {
      message: 'Lấy chi tiết danh mục thành công',
      data: category,
      errorCode: null,
    };
  }

  /**
   * L ấy tất cả descendants (children đệ quy) của một category
   * Vì children embedded, chỉ cần traverse nested structure
   */
  async getDescendants(code: string) {
    const category = await this.categoryModel.findOne({ code }).lean();

    if (!category) {
      return {
        message: 'Không tìm thấy danh mục',
        data: null,
        errorCode: 'CATEGORY_NOT_FOUND',
      };
    }

    // Đệ quy lấy tất cả descendants từ children embedded
    const allDescendants: any[] = [];

    const collectDescendants = (cat: any) => {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      if (cat.children && cat.children.length > 0) {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
        cat.children.forEach((child: any) => {
          allDescendants.push(child);
          collectDescendants(child);
        });
      }
    };

    collectDescendants(category);

    return {
      message: 'Lấy danh sách danh mục con thành công',
      data: allDescendants,
      errorCode: null,
    };
  }

  /**
   * Lấy breadcrumb ancestors của một category
   * Với embedded structure, cần tìm trong toàn bộ tree
   */
  async getAncestors(code: string) {
    // Tìm trong tất cả root categories (không có parentId)
    const allCategories = await this.categoryModel.find({ parentId: null }).lean();

    const ancestors: any[] = [];

    // Tìm category và track path
    const findInTree = (cats: any[], targetCode: string, path: any[]): boolean => {
      for (const cat of cats) {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        if (cat.code === targetCode) {
          // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
          ancestors.push(...path);
          return true;
        }
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        if (cat.children && cat.children.length > 0) {
          // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-assignment
          if (findInTree(cat.children, targetCode, [...path, cat])) {
            return true;
          }
        }
      }
      return false;
    };

    findInTree(allCategories, code, []);

    return {
      message: 'Lấy danh sách danh mục cha thành công',
      data: ancestors,
      errorCode: null,
    };
  }

  /**
   * Cập nhật danh mục theo code
   *
   * @param code - Mã danh mục cần cập nhật
   * @param dto - Dữ liệu cập nhật (partial)
   * @returns Promise với thông tin danh mục đã cập nhật
   *
   * @example
   * ```ts
   * await update("PC-GAMING", { name: "PC Gaming Pro" });
   * ```
   */
  async update(code: string, dto: UpdateCategoryDto) {
    // Kiểm tra danh mục tồn tại
    const existing = await this.categoryModel.findOne({ code }).lean();
    if (!existing) {
      return {
        message: 'Không tìm thấy danh mục để cập nhật',
        data: null,
        errorCode: 'CATEGORY_NOT_FOUND',
      };
    }

    // Nếu update code, kiểm tra trùng lặp
    if (dto.code && dto.code !== existing.code) {
      const codeExists = await this.categoryModel.exists({ code: dto.code });
      if (codeExists) {
        return {
          message: 'Code mới đã tồn tại',
          data: null,
          errorCode: 'CODE_EXISTS',
        };
      }
    }

    // Nếu update slug, kiểm tra trùng lặp
    if (dto.slug && dto.slug !== existing.slug) {
      const slugExists = await this.categoryModel.exists({ slug: dto.slug });
      if (slugExists) {
        return {
          message: 'Slug mới đã tồn tại',
          data: null,
          errorCode: 'SLUG_EXISTS',
        };
      }
    }

    const updated = await this.categoryModel.findOneAndUpdate({ code }, dto, { new: true }).lean();

    if (!updated) {
      return {
        message: 'Không tìm thấy danh mục để cập nhật',
        data: null,
        errorCode: 'CATEGORY_NOT_FOUND',
      };
    }

    return {
      message: 'Cập nhật danh mục thành công',
      data: updated,
      errorCode: null,
    };
  }

  /**
   * Xóa danh mục theo code
   *
   * @param code - Mã danh mục cần xóa
   * @returns Promise với kết quả xóa
   *
   * @remarks
   * Children được xóa tự động vì embedded trong parent document (cascade delete)
   */
  async delete(code: string) {
    const category = await this.categoryModel.findOne({ code }).lean();

    if (!category) {
      return {
        message: 'Không tìm thấy danh mục',
        data: null,
        errorCode: 'CATEGORY_NOT_FOUND',
      };
    }

    // Chỉ cần xóa document chính, children tự động bị xóa vì embedded
    await this.categoryModel.deleteOne({ code });

    return {
      message: 'Xóa danh mục thành công',
      data: null,
      errorCode: null,
    };
  }
}
