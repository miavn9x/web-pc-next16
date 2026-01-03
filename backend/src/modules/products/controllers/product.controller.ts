import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  HttpCode,
  HttpStatus,
  UseGuards,
} from '@nestjs/common';
import { ProductService } from '../services/product.service';
import { CreateProductDto } from '../dtos/create-product.dto';
import { UpdateProductDto } from '../dtos/update-product.dto';
import { FilterProductDto } from '../dtos/filter-product.dto';
import { JwtAuthGuard } from 'src/common/jwt/guards/jwt.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { UserRole } from 'src/modules/users/constants/user-role.enum';

// ===== ADMIN ROUTES =====
@Controller('admin/products')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.ADMIN)
export class AdminProductController {
  constructor(private readonly productService: ProductService) {}

  @Post()
  async create(@Body() dto: CreateProductDto) {
    const product = await this.productService.create(dto);
    return {
      message: 'Product created successfully',
      data: product,
      errorCode: null,
    };
  }

  @Get()
  async findAll(@Query() filter: FilterProductDto) {
    const result = await this.productService.findAll(filter);
    return {
      message: 'Products retrieved successfully',
      data: result.data,
      meta: {
        total: result.total,
        page: result.page,
        limit: result.limit,
        totalPages: result.totalPages,
      },
      errorCode: null,
    };
  }

  @Get(':code')
  async findOne(@Param('code') code: string) {
    const product = await this.productService.findByCode(code);
    return {
      message: 'Product retrieved successfully',
      data: product,
      errorCode: null,
    };
  }

  @Patch(':code')
  async update(@Param('code') code: string, @Body() dto: UpdateProductDto) {
    const product = await this.productService.update(code, dto);
    return {
      message: 'Product updated successfully',
      data: product,
      errorCode: null,
    };
  }

  @Delete(':code')
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(@Param('code') code: string) {
    await this.productService.delete(code);
  }

  @Patch(':code/toggle-active')
  async toggleActive(@Param('code') code: string) {
    const product = await this.productService.toggleActive(code);
    return {
      message: `Product ${product.isActive ? 'activated' : 'deactivated'} successfully`,
      data: product,
      errorCode: null,
    };
  }

  @Patch(':code/toggle-featured')
  async toggleFeatured(@Param('code') code: string) {
    const product = await this.productService.toggleFeatured(code);
    return {
      message: `Product ${product.isFeatured ? 'featured' : 'unfeatured'} successfully`,
      data: product,
      errorCode: null,
    };
  }

  @Patch(':code/toggle-build-pc')
  async toggleBuildPc(@Param('code') code: string) {
    const product = await this.productService.toggleBuildPc(code);
    return {
      message: `Product ${product.isBuildPc ? 'marked as Build PC' : 'unmarked as Build PC'} successfully`,
      data: product,
      errorCode: null,
    };
  }
}

// ===== PUBLIC ROUTES =====
@Controller('products')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Get('price-range')
  async getPriceRange() {
    const range = await this.productService.getPriceRange();
    return {
      message: 'Price range retrieved successfully',
      data: range,
      errorCode: null,
    };
  }

  @Get()
  async findAll(@Query() filter: FilterProductDto) {
    // Public API - filter only active products AND exclude Build PC specific products
    const query = { ...filter, isActive: true, isBuildPc: false };

    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    const result = await this.productService.findAll(query as any);
    return {
      message: 'Products retrieved successfully',
      data: result.data,
      meta: {
        total: result.total,
        page: result.page,
        limit: result.limit,
        totalPages: result.totalPages,
      },
      errorCode: null,
    };
  }

  @Get('slug/:slug')
  async findBySlug(@Param('slug') slug: string) {
    const product = await this.productService.findBySlug(slug);
    return {
      message: 'Product retrieved successfully',
      data: product,
      errorCode: null,
    };
  }

  @Get(':code/related')
  async getRelated(@Param('code') code: string, @Query('limit') limit?: number) {
    const products = await this.productService.findRelated(
      code,
      limit ? parseInt(limit.toString()) : 4,
    );
    return {
      message: 'Related products retrieved successfully',
      data: products,
      errorCode: null,
    };
  }
}
