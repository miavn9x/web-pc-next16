import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/common/jwt/guards/jwt.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { UserRole } from 'src/modules/users/constants/user-role.enum';
import { CategoryService } from '../services/category.service';
import { CreateCategoryDto } from '../dtos/create-category.dto';
import { UpdateCategoryDto } from '../dtos/update-category.dto';

@Controller('products/categories')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  create(@Body() dto: CreateCategoryDto) {
    return this.categoryService.create(dto);
  }

  @Get()
  findAll() {
    return this.categoryService.findAll();
  }

  /**
   * Lấy cây danh mục phân cấp đầy đủ
   */
  @Get('tree')
  getCategoryTree() {
    return this.categoryService.getCategoryTree();
  }

  @Get(':code')
  findOne(@Param('code') code: string) {
    return this.categoryService.findOne(code);
  }

  /**
   * Lấy cây con từ một danh mục cụ thể theo code
   */
  @Get(':code/tree')
  getCategorySubtree(@Param('code') code: string) {
    return this.categoryService.getCategoryTree(code);
  }

  /**
   * Lấy tất cả danh mục cha (ancestors) của một danh mục theo code
   */
  @Get(':code/ancestors')
  getAncestors(@Param('code') code: string) {
    return this.categoryService.getAncestors(code);
  }

  /**
   * Lấy tất cả danh mục con (descendants) của một danh mục theo code
   */
  @Get(':code/descendants')
  getDescendants(@Param('code') code: string) {
    return this.categoryService.getDescendants(code);
  }

  @Patch(':code')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  update(@Param('code') code: string, @Body() dto: UpdateCategoryDto) {
    return this.categoryService.update(code, dto);
  }

  @Delete(':code')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  delete(@Param('code') code: string) {
    return this.categoryService.delete(code);
  }
}
