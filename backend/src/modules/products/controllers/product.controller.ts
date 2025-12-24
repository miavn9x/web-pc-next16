import { CacheInterceptor, CacheTTL } from '@nestjs/cache-manager';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { Roles } from 'src/common/decorators/roles.decorator';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { JwtAuthGuard } from 'src/common/jwt/guards/jwt.guard';
import { UserRole } from 'src/modules/users/constants/user-role.enum';
import { CreateProductDto } from '../dtos/create-product.dto';
import { UpdateProductDto } from '../dtos/update-product.dto';
import { ProductService } from '../services/product.service';

@Controller('products')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  // Tạo sản phẩm mới
  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  create(@Body() dto: CreateProductDto) {
    return this.productService.create(dto);
  }

  // Cập nhật sản phẩm theo productCode
  @Patch(':productCode')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  update(@Param('productCode') productCode: string, @Body() dto: UpdateProductDto) {
    return this.productService.update(productCode, dto);
  }

  // Lấy tất cả sản phẩm với phân trang
  @Get()
  @UseInterceptors(CacheInterceptor)
  @CacheTTL(120)
  findAll(@Query('page') page = '1', @Query('limit') limit = '50') {
    return this.productService.findAllPaginated(+page, +limit);
  }

  // Lấy sản phẩm theo danh mục với phân trang
  @Get('category/:category')
  @UseInterceptors(CacheInterceptor)
  @CacheTTL(180)
  findByCategory(
    @Param('category') category: string,
    @Query('page') page = '1',
    @Query('limit') limit = '50',
  ) {
    return this.productService.findByCategory(Number(category), +page, +limit);
  }

  // Tìm kiếm sản phẩm theo query
  @Get('search')
  @UseInterceptors(CacheInterceptor)
  @CacheTTL(60)
  search(@Query('q') keyword: string) {
    return this.productService.search(keyword);
  }
  // Lấy chi tiết sản phẩm theo productCode
  @Get(':productCode')
  findOne(@Param('productCode') productCode: string) {
    return this.productService.findByCode(productCode);
  }

  // Xóa sản phẩm theo productCode
  @Delete(':productCode')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  delete(@Param('productCode') productCode: string) {
    return this.productService.delete(productCode);
  }
}
