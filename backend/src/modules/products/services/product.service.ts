/* eslint-disable */
import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ConflictException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Product } from '../schemas/product.schema';
import { Category } from '../categories/schemas/category.schema';
import { CreateProductDto } from '../dtos/create-product.dto';
import { UpdateProductDto } from '../dtos/update-product.dto';
import { FilterProductDto, SortOrder } from '../dtos/filter-product.dto';
import { generateSlugFromName } from '../utils/string.util';

interface PaginatedResult<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

@Injectable()
export class ProductService {
  constructor(
    @InjectModel(Product.name) private productModel: Model<Product>,
    @InjectModel(Category.name) private categoryModel: Model<Category>,
  ) {}

  // ===== AUTO GENERATION =====

  async generateProductCode(categoryCode: string): Promise<string> {
    const prefix = categoryCode.substring(0, 2).toUpperCase();

    const lastProduct = await this.productModel
      .findOne({ productCode: new RegExp(`^${prefix}`) })
      .sort({ productCode: -1 })
      .exec();

    if (!lastProduct) {
      return `${prefix}001`;
    }

    const lastNumber = parseInt(lastProduct.productCode.substring(2));
    const newNumber = (lastNumber + 1).toString().padStart(3, '0');

    return `${prefix}${newNumber}`;
  }

  generateSlug(name: string, productCode: string): string {
    const nameSlug = generateSlugFromName(name);
    return `${nameSlug}-${productCode.toLowerCase()}`;
  }

  generateSearchKey(dto: CreateProductDto | UpdateProductDto): string {
    const parts = [
      dto.name,
      dto.brand,
      ...(dto.specs ? dto.specs.map(s => `${s.label} ${s.value}`) : []),
    ].filter(Boolean);

    return generateSlugFromName(parts.join(' '));
  }

  // ===== CRUD =====

  // Helper: Find full path to category [Root, Child, ..., Leaf]
  private findCategoryPath(categories: Category[], targetCode: string): Category[] | null {
    for (const category of categories) {
      if (category.code === targetCode) {
        return [category];
      }
      if (category.children && category.children.length > 0) {
        const path = this.findCategoryPath(category.children, targetCode);
        if (path) {
          return [category, ...path];
        }
      }
    }
    return null;
  }

  async create(dto: CreateProductDto): Promise<Product> {
    // Fetch all root categories (lean) to search recursively
    // Note: We need a better way if data grows, but for menu this is fine
    const allCategories = await this.categoryModel.find().lean().exec();

    // Find path to the selected category
    const categoryPath = this.findCategoryPath(allCategories, dto.categoryCode);

    if (!categoryPath || categoryPath.length === 0) {
      throw new NotFoundException(`Category with code "${dto.categoryCode}" not found`);
    }

    // The selected category is the last one in the path
    const category = categoryPath[categoryPath.length - 1];

    // Auto-generate fields
    const productCode = await this.generateProductCode(dto.categoryCode);
    const slug = this.generateSlug(dto.name, productCode);

    // Ensure filters is populated (default to empty object if undefined)
    const filters = dto.filters || {};

    // Use filters for searchKey generation if needed, or just standard fields
    // Updated generateSearchKey might already handle this if dto includes it.
    // For now, keeping existing generateSearchKey call.
    const searchKey = this.generateSearchKey(dto);

    // Check slug uniqueness
    const existingSlug = await this.productModel.findOne({ slug }).exec();
    if (existingSlug) {
      throw new ConflictException(`Product slug "${slug}" already exists`);
    }

    // --- HIERARCHY LOGIC ---
    // 1. categorySlug is ALWAYS the Root Category (Level 1)
    const rootCategory = categoryPath[0];
    const categorySlug = rootCategory.slug;
    const categoryPriceRanges = rootCategory.priceRanges || [];

    // 2. subcategory info comes from Level 2 (if exists)
    // If user selected L1, subcategory is empty
    // If user selected L2 or L3, subcategory is the L2 node
    let subcategory = '';
    let subcategorySlug = '';

    if (categoryPath.length >= 2) {
      const subCat = categoryPath[1]; // Level 2
      subcategory = subCat.name;
      subcategorySlug = subCat.slug;
    }

    // Create product
    const product = new this.productModel({
      ...dto,
      filters, // Explicitly include filters
      productCode,
      slug,
      searchKey,
      categorySlug,
      subcategory,
      subcategorySlug,
      categoryPriceRanges,
    });

    return product.save();
  }

  async findAll(filter: FilterProductDto): Promise<PaginatedResult<Product>> {
    const query: any = {};

    // Category filter
    if (filter.categoryCode) {
      // Use regex to match hierarchical codes (e.g. searching "PARENT" finds "PARENT-CHILD")
      query.categoryCode = { $regex: `^${filter.categoryCode}` };
    }

    // Text search (Regex for partial match)
    if (filter.search) {
      const searchRegex = new RegExp(filter.search, 'i'); // Case-insensitive
      query.$or = [
        { name: { $regex: searchRegex } },
        { productCode: { $regex: searchRegex } },
        { brand: { $regex: searchRegex } },
        { searchKey: { $regex: searchRegex } },
      ];
    }

    // Price range
    if (filter.minPrice !== undefined || filter.maxPrice !== undefined) {
      query.price = {};
      if (filter.minPrice !== undefined) {
        query.price.$gte = filter.minPrice;
      }
      if (filter.maxPrice !== undefined) {
        query.price.$lte = filter.maxPrice;
      }
    }

    // Brand filter
    if (filter.brand) {
      query.brand = filter.brand;
    }

    // Featured filter
    if (filter.isFeatured) {
      query.isFeatured = true;
    }

    // Build PC filter
    // If filter.isBuildPc is defined (true/false), filter by it.
    // If undefined (e.g. Admin default), DO NOT filter property (show ALL).
    if (filter.isBuildPc !== undefined) {
      if (filter.isBuildPc === true) {
        query.isBuildPc = true;
      } else {
        query.isBuildPc = { $ne: true };
      }
    }

    // Count total
    const total = await this.productModel.countDocuments(query).exec();

    // Execute query with pagination
    const page = filter.page ?? 1;
    const limit = filter.limit ?? 20;
    const sortField = filter.sortBy || 'createdAt';
    const sortDirection = filter.sortOrder === SortOrder.ASC ? 1 : -1;

    const products = await this.productModel
      .find(query)
      .select(
        'name productCode price originalPrice discount cover slug categorySlug isFeatured isBuildPc viewCount createdAt',
      )
      .sort({ [sortField]: sortDirection })
      .skip((page - 1) * limit)
      .limit(limit)
      .exec();

    return {
      data: products,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findByCode(productCode: string): Promise<Product> {
    const product = await this.productModel.findOne({ productCode }).exec();

    if (!product) {
      throw new NotFoundException(`Product with code "${productCode}" not found`);
    }

    return product;
  }

  async findBySlug(slug: string): Promise<Product> {
    const product = await this.productModel.findOne({ slug }).exec();

    if (!product) {
      throw new NotFoundException(`Product with slug "${slug}" not found`);
    }

    // Increment view count
    await this.incrementViewCount(product.productCode);

    return product;
  }

  async update(productCode: string, dto: UpdateProductDto): Promise<Product> {
    const product = await this.findByCode(productCode);

    // If name changed, regenerate slug
    if (dto.name && dto.name !== product.name) {
      const newSlug = this.generateSlug(dto.name, productCode);
      const existingSlug = await this.productModel
        .findOne({ slug: newSlug, productCode: { $ne: productCode } })
        .exec();

      if (existingSlug) {
        throw new ConflictException(`Slug "${newSlug}" already exists`);
      }

      (dto as any)['slug'] = newSlug;
    }

    // Regenerate searchKey if relevant fields changed
    if (dto.name || dto.brand || dto.specs) {
      (dto as any)['searchKey'] = this.generateSearchKey({
        ...product.toObject(),
        ...dto,
      });
    }

    // If category changed, re-fetch category info to update denormalized fields
    if (dto.categoryCode && dto.categoryCode !== product.categoryCode) {
      const allCategories = await this.categoryModel.find().lean().exec();
      const categoryPath = this.findCategoryPath(allCategories, dto.categoryCode);

      if (!categoryPath || categoryPath.length === 0) {
        throw new NotFoundException(`Category with code "${dto.categoryCode}" not found`);
      }

      // Root Category (Level 1)
      const rootCategory = categoryPath[0];
      (dto as any)['categorySlug'] = rootCategory.slug;
      (dto as any)['categoryPriceRanges'] = rootCategory.priceRanges || [];

      // Subcategory (Level 2)
      if (categoryPath.length >= 2) {
        const subCat = categoryPath[1];
        (dto as any)['subcategory'] = subCat.name;
        (dto as any)['subcategorySlug'] = subCat.slug;
      } else {
        // If moved to a Root category, clear subcategory fields
        (dto as any)['subcategory'] = '';
        (dto as any)['subcategorySlug'] = '';
      }
    }

    Object.assign(product, dto);
    return product.save();
  }

  async delete(productCode: string): Promise<void> {
    const result = await this.productModel.deleteOne({ productCode }).exec();

    if (result.deletedCount === 0) {
      throw new NotFoundException(`Product with code "${productCode}" not found`);
    }
  }

  // ===== ADVANCED =====

  async findRelated(productCode: string, limit: number = 4): Promise<Product[]> {
    const product = await this.findByCode(productCode);

    return this.productModel
      .find({
        productCode: { $ne: productCode },
        // Use categorySlug (Root Category) to find items in the same main category
        // If categories are very diverse, strict categoryCode might return 0 results
        categorySlug: product.categorySlug,
        isActive: true,
      })
      .sort({ createdAt: -1 })
      .limit(limit)
      .exec();
  }

  async incrementViewCount(productCode: string): Promise<void> {
    await this.productModel.updateOne({ productCode }, { $inc: { viewCount: 1 } }).exec();
  }

  async toggleActive(productCode: string): Promise<Product> {
    const product = await this.findByCode(productCode);
    product.isActive = !product.isActive;
    return product.save();
  }

  async toggleFeatured(productCode: string): Promise<Product> {
    const product = await this.findByCode(productCode);
    product.isFeatured = !product.isFeatured;
    return product.save();
  }

  async toggleBuildPc(productCode: string): Promise<Product> {
    const product = await this.findByCode(productCode);
    product.isBuildPc = !product.isBuildPc;
    return product.save();
  }

  async getPriceRange(): Promise<{ min: number; max: number }> {
    const result = await this.productModel
      .aggregate([
        { $match: { isActive: true } },
        {
          $group: {
            _id: null,
            min: { $min: '$price' },
            max: { $max: '$price' },
          },
        },
      ])
      .exec();

    if (result.length > 0) {
      return { min: result[0].min || 0, max: result[0].max || 0 };
    }
    return { min: 0, max: 0 };
  }
}
