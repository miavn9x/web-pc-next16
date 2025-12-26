// --- [Thư viện] ---
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
  UseInterceptors,
  UseGuards,
} from '@nestjs/common';
import { CreatePostDto } from '../dtos/create-post.dto';
import { UpdateOrderDto } from '../dtos/update-post.dto';
import { PostService } from '../services/post.service';
import { JwtAuthGuard } from '../../../common/jwt/guards/jwt.guard';
import { RolesGuard } from '../../../common/guards/roles.guard';
import { Roles } from '../../../common/decorators/roles.decorator';
import { UserRole } from '../../users/constants/user-role.enum';

@Controller('posts')
export class PostController {
  constructor(private readonly postService: PostService) {}

  // --- Tạo mới bài viết ---
  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  async create(@Body() dto: CreatePostDto) {
    return this.postService.create(dto);
  }

  // --- Cập nhật bài viết ---
  @Patch(':code')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  async update(@Param('code') code: string, @Body() dto: UpdateOrderDto) {
    return this.postService.update(code, dto);
  }

  // --- Lấy danh sách tất cả bài viết ---
  @Get()
  @UseInterceptors(CacheInterceptor)
  @CacheTTL(120)
  async findAll(
    @Query('page') page = '1',
    @Query('limit') limit = '50',
    @Query('search') search = '',
  ) {
    return this.postService.findAll(+page, +limit, search);
  }

  // --- Lấy chi tiết bài viết ---
  @Get(':code')
  async findOne(@Param('code') code: string) {
    return this.postService.findOne(code);
  }

  // --- Xoá bài viết ---
  @Delete(':code')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  async delete(@Param('code') code: string) {
    return this.postService.delete(code);
  }
}
