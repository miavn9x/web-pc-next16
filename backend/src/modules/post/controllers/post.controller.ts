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
} from '@nestjs/common';
import { CreatePostDto } from '../dtos/create-post.dto';
import { UpdateOrderDto } from '../dtos/update-post.dto';
import { PostService } from '../services/post.service';

@Controller('posts')
export class PostController {
  constructor(private readonly postService: PostService) {}

  // --- Tạo mới bài viết ---
  @Post()
  async create(@Body() dto: CreatePostDto) {
    return this.postService.create(dto);
  }

  // --- Cập nhật bài viết ---
  @Patch(':code')
  async update(@Param('code') code: string, @Body() dto: UpdateOrderDto) {
    return this.postService.update(code, dto);
  }

  // --- Lấy danh sách tất cả bài viết ---
  @Get()
  @UseInterceptors(CacheInterceptor)
  @CacheTTL(120)
  async findAll(@Query('page') page = '1', @Query('limit') limit = '50') {
    return this.postService.findAll(+page, +limit);
  }

  // --- Lấy chi tiết bài viết ---
  @Get(':code')
  async findOne(@Param('code') code: string) {
    return this.postService.findOne(code);
  }

  // --- Xoá bài viết ---
  @Delete(':code')
  async delete(@Param('code') code: string) {
    return this.postService.delete(code);
  }
}
